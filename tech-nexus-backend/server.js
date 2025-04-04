import express from "express";
import cors from "cors";
import pool from "./db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const forbiddenChars = /["'`;<>\\\n\r\t\b\f]|\/\*|\*\//;

// Dynamic path to imgs
const imagesDir = path.join(__dirname, "../tech-nexus-frontend/public/images");

const app = express();

//Middleware
app.use(cors());
app.use(express.json());
app.use("/images", express.static(imagesDir)); // Img folder in url

// Storage settings for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Middleware for file upload
const upload = multer({ storage });
    
// Route to get all products on start page
app.get("/", async (req, res) => {
    try {
        const allProducts = await pool.query(`SELECT 
                                                p.id, 
                                                p.product_name, 
                                                pr.producer_name AS producer, 
                                                p.price, 
                                                c.category_name, 
                                                pi.img_url
                                            FROM products p
                                            JOIN brands b ON p.brand_name_id = b.id
                                            JOIN categories c ON p.category_name_id = c.id
                                            JOIN producers pr ON p.producer_id = pr.id
                                            LEFT JOIN product_imgs pi ON p.id = pi.product_id AND pi.is_main = true
                                            ORDER BY p.id;`);

        res.json(allProducts.rows);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Code 500 (Server error)'});
    }
});

// Route to get specific product, using it's id
app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productById = await pool.query(`SELECT 
                                                p.product_name,
                                                pr.producer_name AS producer,
                                                p.price,
                                                p.description,
                                                b.brand_name,
                                                mc.master_category_name,
                                                c.category_name,
                                                COALESCE(json_agg(DISTINCT jsonb_build_object(
                                                    'attribute', a.attribute,
                                                    'value', av.attribute_value
                                                )) FILTER (WHERE a.id IS NOT NULL), '[]') AS attributes,
                                                COALESCE(json_agg(DISTINCT jsonb_build_object(
                                                    'img_url', pi.img_url,
                                                    'is_main', pi.is_main
                                                )) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
                                                FROM products p
                                                JOIN brands b ON p.brand_name_id = b.id
                                                JOIN categories c ON p.category_name_id = c.id
                                                JOIN master_categories mc ON c.master_category_name_id = mc.id
                                                JOIN producers pr ON p.producer_id = pr.id
                                                LEFT JOIN product_attributes pa ON p.id = pa.product_id
                                                LEFT JOIN attribute_values av ON pa.attribute_value_id = av.id
                                                LEFT JOIN attributes a ON av.attribute_name_id = a.id
                                                LEFT JOIN product_imgs pi ON p.id = pi.product_id
                                                WHERE p.id = $1
                                                GROUP BY p.id, b.brand_name, mc.master_category_name, c.category_name, pr.producer_name;`, [id]);

        if (productById.rows.length === 0){
            res.status(404).json({error: 'Code 404 (Not found)'});
        }
        
        res.json(productById.rows[0]); 
    }
    catch(error) {
        console.error(error);
        res.status(500).json({error: "Code 500 (Server error)"});
    }
});

// Route for user registration
// Password is being hashed using bcrypt module
// BURN THIS WITH FLAMETHROWER
// Optimize repetitions
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

        if(!username || !email || !password) {
            return res.status(400).json({ error: "Все поля обязательны для заполнения" });
        };

        if(password.length < 8 || password.length > 30) {
            return res.status(400).json({ error: "Пароль должен быть от 8 до 30 символов включительно" })
        };

        if(forbiddenChars.test(password)) {
            return res.status(400).json( {error: "Пароль содержит один или несколько запрещенных символов"} );
        };

        if(username.length < 3 || username.length > 15){
            return res.status(400).json({ error: "Имя пользователя должно быть от 3 до 15 символов включительно" });
        };

        if(forbiddenChars.test(username)) {
            return res.status(400).json({ error: "Имя пользователя содержит один или несколько запрещенных символов" });
        };

        if(!emailRegex.test(email)) {
            return res.status(400).json({ error: "Неверный формат email, используйте существующий адрес электронной почты" });
        };
        
        if(forbiddenChars.test(email)) {
            return res.status(400).json({ error: "email содержит один или несколько запрещенных символов" });
        };

        const existingUser = await pool.query(
            `SELECT * FROM users WHERE email = $1 OR username = $2;`,
            [email, username]
        );

        if(existingUser.rows.length > 0) {
            return res.status(400).json( {error: "Пользователь с таким именем или email уже существует" } );
        };

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const registration = await pool.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            newUser: registration.rows[0]
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for user sign in
// (Email OR Username) AND Password is required
// Password is being compared with existing hash in the database using bcrypt module
app.post("/login", async (req, res) => {
    try{
        const { login, password } = req.body;

        const user = await pool.query(
            `SELECT * FROM users WHERE username = $1 OR email = $1`,
            [login]
        );

        if (user.rows.length === 0){
            return res.status(401).json({ error: "Неверный логин или пароль" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);

        if(!validPassword){
            return res.status(401).json({ error: "Неверный логин или пароль" });
        };

        res.status(200).json({ message: "Вход был выполнен успешно", user: user.rows[0] });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Mini profile: img and name in header
app.get("/mini_profile/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const miniUser = await pool.query(`SELECT username, profile_img FROM users WHERE id = $1`, [user_id]);

        if (miniUser.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json(miniUser.rows[0]);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for main user profile by id
app.get("/profile/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const userProfile = await pool.query(`SELECT 
                                                u.id,
                                                u.username,
                                                u.is_seller,
                                                u.profile_img,
                                                u.shipping_address,
                                                u.balance,
                                                b.brand_name,
                                                b.brand_img,
                                                b.brand_description
                                            FROM users u
                                            LEFT JOIN brands b ON u.id = b.user_id
                                            WHERE u.id = $1`, [user_id]);

        if (userProfile.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(userProfile.rows[0]);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for brand creation by user id
app.post("/create/brand", upload.single("brand_img"), async (req, res) => {
    try {
        const { user_id, brand_name, brand_description } = req.body;

        if (forbiddenChars.test(brand_name) || forbiddenChars.test(brand_description)) {
            return res.status(400).json({ error: "Название бренда или описание содержит один или несколько запрещенных символов" });
        }

        if (brand_name.length < 4 || brand_name.length > 15) {
            return res.status(400).json({ error: "Название бренда должно быть от 4 до 15 символов включительно" });
        }

        if (brand_description.length > 400) {
            return res.status(400).json({ error: "Описание бренда не должно превышать 400 символов" });
        }

        const brand_img = req.file ? `/images/${req.file.filename}` : null;

        // Creation of new brand
        const newBrand = await pool.query(
            `INSERT INTO brands (user_id, brand_name, brand_img, brand_description)
             VALUES ($1, $2, $3, $4) RETURNING *;`,
             [user_id, brand_name, brand_img, brand_description]
        );

        // Update of user is_seller status to true
        await pool.query(
            `UPDATE users SET is_seller = true WHERE id = $1;`,
            [user_id]  
        );

        res.status(201).json({
            message: "Бренд успешно создан и статус продавца установлен",
            brand: newBrand.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Rout for updating brand information by user_id
app.put("/update/brand", upload.single("brand_img"), async (req, res) => {
    try {
        const { user_id, brand_name, brand_description } = req.body;

        const brand_img = req.file ? `/images/${req.file.filename}` : null;

        const currentBrand = await pool.query(
            `SELECT brand_name, brand_description, brand_img FROM brands WHERE user_id = $1`,
            [user_id]
        );

        if (currentBrand.rows.length === 0) {
            return res.status(404).json({ error: "Бренд не найден" });
        }

        const { brand_name: currentName, brand_description: currentDescription, brand_img: currentImg } = currentBrand.rows[0];

        // Check if AT LEAST one of the fields is updated
        if (
            (!brand_name || brand_name === currentName) &&
            (!brand_description || brand_description === currentDescription) &&
            (!brand_img || brand_img === currentImg)
        ) {
            return res.status(400).json( {error: "Необходимо изменить хотя бы одно поле для обновления" } );
        }

        if (forbiddenChars.test(brand_name) || forbiddenChars.test(brand_description)) {
            return res.status(400).json({ error: "Название бренда или описание содержит один или несколько запрещенных символов" });
        }

        if (brand_name && (brand_name.length < 4 || brand_name.length > 15)) {
            return res.status(400).json({ error: "Название бренда должно быть от 4 до 15 символов включительно" });
        }

        if (brand_description.length > 400) {
            return res.status(400).json({ error: "Описание бренда не должно превышать 400 символов" });
        }

        // IF brand_img is updated DELETE the old one
        if (brand_img && currentImg && brand_img !== currentImg) {
            const editedCurrentImg = currentImg.replace(/^\/images\//, '');

            const oldImagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedCurrentImg);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Dynamic query for updating brand
        const updates = [];
        const values = [];
        let index = 1;

        if (brand_name && brand_name !== currentName) {
            updates.push(`brand_name = $${index}`);
            values.push(brand_name);
            index++;
        }

        if (brand_description && brand_description !== currentDescription) {
            updates.push(`brand_description = $${index}`);
            values.push(brand_description);
            index++;
        }

        if (brand_img && brand_img !== currentImg) {
            updates.push(`brand_img = $${index}`);
            values.push(brand_img);
            index++;
        }

        const updateQuery = `UPDATE brands SET ${updates.join(", ")} WHERE user_id = ${user_id} RETURNING *;`;

        const updatedBrand = await pool.query(updateQuery, values);

        res.status(200).json({
            message: "Бренд успешно обновлен",
            brand: updatedBrand.rows[0]
        });

    }   
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for deleting brand by user_id 
// ADD BRAND PIC DELETION
app.delete("/delete/brand", async (req, res) => {
    try {
        const { user_id, brand_img } = req.body;

        if (brand_img) {
            const editedBrandImg = brand_img.replace(/^\/images\//, '');

            const imagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedBrandImg);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pool.query("UPDATE users SET is_seller = false WHERE id = $1;", [user_id]);

        const deletedBrand = await pool.query(`DELETE FROM brands WHERE user_id = $1 RETURNING *;`, [user_id]);

        if (deletedBrand.rows.length === 0) {
            return res.status(404).json({ error: "Бренд не найден" });
        }

        res.status(200).json({
            message: "Бренд успешно удален",
            deletedBrand: deletedBrand.rows[0]
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

app.listen(8000, () => {
    console.log("Server is listenning on port 8000");
});