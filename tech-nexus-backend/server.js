import express from "express";
import cors from "cors";
import pool from "./db.js";
import bcrypt from "bcrypt";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const forbiddenChars = /["'`;<>\\\n\r\t\b\f]|\/\*|\*\//;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

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
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
    }
});

// Middleware for file upload
const upload = multer({ storage });

// Function to delete files from /images folder
const deleteUploadedFiles = (files) => {
    if (!files) return;

    Object.values(files).flat().forEach(file => {
        /* const editedFileName = file.replace(/^\/images\//, ''); */
        const filePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", file.filename);
        fs.unlink(filePath, (err) => {
            if (err) console.error("File deletion error:", err);
        });
    });
};
    
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
                                                b.id AS brand_id,
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
                                                GROUP BY b.id, p.id, b.brand_name, mc.master_category_name, c.category_name, pr.producer_name;`, [id]);

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
            return res.status(400).json( {error: "Пользователь с таким именем или Email уже существует" } );
        };

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const registration = await pool.query(
            `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;`,
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: "Вы успешно зарегистрировались",
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
                                                u.email,
                                                u.password,
                                                b.id AS brand_id,
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

// Rout for updating user profile by user_id 
app.put("/update/profile", upload.single("profile_img"), async (req, res) => {
    try {
        const { user_id, username, email, password, old_password, shipping_address } = req.body;

        const profile_img = req.file ? `/images/${req.file.filename}` : null;

        const currentProfile = await pool.query(
            `SELECT username, email, password, profile_img, shipping_address FROM users WHERE id = $1`,
            [user_id]
        );

        if (currentProfile.rows.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }

        const { username: currentUsername, email: currentEmail, password: currentPassword, profile_img: currentProfileImg, shipping_address: currentShippingAddress } = currentProfile.rows[0];

        // Check if AT LEAST one of the fields is updated
        if (
            (!username || username === currentUsername) &&
            (!email || email === currentEmail) &&
            (!password || password === currentPassword) &&
            (!shipping_address || shipping_address === currentShippingAddress) &&
            (!profile_img || profile_img === currentProfileImg)
        ) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Необходимо изменить хотя бы одно поле для обновления" });
        }

        if (email !== currentEmail || password) {

            if (!old_password) {
                deleteUploadedFiles(req.files);
                return res.status(400).json({ error: "Введите текущий пароль" });
            }

            const validPassword = await bcrypt.compare(old_password, currentProfile.rows[0].password);

            if(!validPassword){
                deleteUploadedFiles(req.files);
                return res.status(401).json({ error: "Неверный текущий пароль" });
            }
        }

        if (forbiddenChars.test(username) || forbiddenChars.test(email) || forbiddenChars.test(password) || forbiddenChars.test(shipping_address)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Одно из заполняемых полей содержит один или несколько запрещенных символов" });
        }

        if (email && (!emailRegex.test(email))) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Неверный формат email, используйте существующий адрес электронной почты" });
        }

        if(username && (username.length < 3 || username.length > 15)){
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Имя пользователя должно быть от 3 до 15 символов включительно" });
        }

        if(password && (password.length < 8 || password.length > 30)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Пароль должен быть от 8 до 30 символов включительно" })
        }

        if (shipping_address && (shipping_address.length > 400)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Адрес доставки не должен превышать 400 символов" });
        }

        if (username && username !== currentUsername) {
            const existingUsername = await pool.query(
                `SELECT * FROM users WHERE username = $1`,
                [username]
            );
            if (existingUsername.rows.length > 0) {
                deleteUploadedFiles(req.files);
                return res.status(400).json({ error: "Пользователь с таким именем уже существует" });
            }
        }
        
        if (email && email !== currentEmail) {
            const existingEmail = await pool.query(
                `SELECT * FROM users WHERE email = $1`,
                [email]
            );
            if (existingEmail.rows.length > 0) {
                deleteUploadedFiles(req.files);
                return res.status(400).json({ error: "Пользователь с таким Email уже существует" });
            }
        }

        // IF profile_img is updated DELETE the old one
        if (profile_img && currentProfileImg && profile_img !== currentProfileImg) {
            const editedCurrentProfileImg = currentProfileImg.replace(/^\/images\//, '');

            const oldImagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedCurrentProfileImg);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        
        // Dynamic query for updating profile
        const updates = [];
        const values = [];
        let index = 1;

        if (username && username !== currentUsername) {
            updates.push(`username = $${index}`);
            values.push(username);
            index++;
        }

        if (email && email !== currentEmail) {
            updates.push(`email = $${index}`);
            values.push(email);
            index++;
        }

        if (password && password !== currentPassword) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updates.push(`password = $${index}`);
            values.push(hashedPassword);
            index++;
        }

        if (shipping_address && shipping_address !== currentShippingAddress) {
            updates.push(`shipping_address = $${index}`);
            values.push(shipping_address);
            index++;
        }

        if (profile_img && profile_img !== currentProfileImg) {
            updates.push(`profile_img = $${index}`);
            values.push(profile_img);
            index++;
        }

        const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id = ${user_id} RETURNING *;`;

        const updatedProfile = await pool.query(updateQuery, values);

        res.status(200).json({
            message: "Профиль успешно обновлен",
            profile: updatedProfile.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        deleteUploadedFiles(req.files);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for profile deletion by user_id
app.delete("/delete/profile", async (req, res) => {
    try {
        const { user_id, profile_img, brand_img } = req.body;

        if (profile_img) {
            const editedProfileImg = profile_img.replace(/^\/images\//, '');

            const imagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedProfileImg);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        if (brand_img) {
            const editedBrandImg = brand_img.replace(/^\/images\//, '');

            const imagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedBrandImg);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pool.query("UPDATE users SET is_seller = false WHERE id = $1;", [user_id]);

        const deletedPrfofile = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *;", [user_id]);

        res.status(200).json({
            message: "Профиль и связанный с ним бренд успешно удалены",
            deletedProfile: deletedPrfofile.rows[0]
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });;
    }
});

// Route for brand creation by user id
app.post("/create/brand", upload.single("brand_img"), async (req, res) => {
    try {
        const { user_id, brand_name, brand_description } = req.body;

        if (forbiddenChars.test(brand_name) || forbiddenChars.test(brand_description)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Название бренда или описание содержит один или несколько запрещенных символов" });
        }

        if (brand_name.length < 4 || brand_name.length > 15) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Название бренда должно быть от 4 до 15 символов включительно" });
        }

        if (brand_description.length > 400) {
            deleteUploadedFiles(req.files);
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
        deleteUploadedFiles(req.files);
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
            deleteUploadedFiles(req.files);
            return res.status(400).json( {error: "Необходимо изменить хотя бы одно поле для обновления" } );
        }

        if (forbiddenChars.test(brand_name) || forbiddenChars.test(brand_description)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Название бренда или описание содержит один или несколько запрещенных символов" });
        }

        if (brand_name && (brand_name.length < 4 || brand_name.length > 15)) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ error: "Название бренда должно быть от 4 до 15 символов включительно" });
        }

        if (brand_description.length > 400) {
            deleteUploadedFiles(req.files);
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
        deleteUploadedFiles(req.files);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for deleting brand by user_id 
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

// Get data to create poroduct in product constructor
app.get("/product-constructor-data", async (req, res) => {
    try {
        const producersResult = await pool.query(
            "SELECT id, producer_name FROM producers"
        );

        const categoriesResult = await pool.query(
            "SELECT id, category_name FROM categories"
        );

        const attributesWithValuesResult = await pool.query(`
            SELECT 
                a.id AS attribute_id,
                a.attribute AS attribute_name,
                a.category_name_id AS category_id,
                av.id AS value_id,
                av.attribute_value
            FROM attributes a
            JOIN attribute_values av
            ON a.id = av.attribute_name_id
        `);

        const attributesMap = new Map();

        for (const row of attributesWithValuesResult.rows) {
            if (!attributesMap.has(row.attribute_id)) {
                attributesMap.set(row.attribute_id, {
                    attribute_id: row.attribute_id,
                    attribute_name: row.attribute_name,
                    category_id: row.category_id,
                    values: []
                });
            }

            attributesMap.get(row.attribute_id).values.push({
                value_id: row.value_id,
                attribute_value: row.attribute_value
            });
        }

        const attributes = Array.from(attributesMap.values());

        res.json({
            producers: producersResult.rows,
            categories: categoriesResult.rows,
            attributes
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for product creation in product constructor
app.post("/create/product", upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 14}
]), async (req, res) => {
    try {
        const { user_id, product_name, price, description, category_id, attributes, producer_id } = req.body;

        if (!product_name || !price || !category_id || !producer_id || !description || !attributes || !req.files['mainImage']) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "Заполните все обязательные поля, как минимум одну пару атрибут-значение и загрузите главное изображение" });
        }

        if (forbiddenChars.test(product_name) || forbiddenChars.test(description) || forbiddenChars.test(price)) {
            deleteUploadedFiles(req.files);
            res.status(400).json({ message: "Одно из заполняемых полей содержит один или несколько запрещенных символов" });
        }

        if (product_name.length < 3 || product_name.length > 150 ) {
            deleteUploadedFiles(req.files);
            res.status(400).json({ message: "Название товара должно быть длинной от 3 до 150 символов включительно" });
        }

        if (description.length > 600 ) {
            deleteUploadedFiles(req.files);
            res.status(400).json({ message: "Описание товара должно быть длинной не более 600 символов включительно" });
        }

        if (isNaN(parseInt(price)) || parseInt(price) <= 0 || parseInt(price) >= 1000000 ) {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "Цена должна быть числом, не меньше 0 и не больше 1000000" });
        }

        const brand = await pool.query("SELECT id FROM brands WHERE user_id = $1", [user_id]);
        if (brand.rowCount === 0) return res.status(404).json({ error: 'Бренд не найден' });
        
        const brand_id = brand.rows[0].id;

        const newProduct = await pool.query(
            `INSERT INTO products (product_name, brand_name_id, price, category_name_id, description, producer_id) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [
                product_name,
                brand_id,
                price,
                category_id,
                description,
                producer_id
            ]
        );

        const product_id = newProduct.rows[0].id;

        const parsedAttributes = JSON.parse(attributes);

        // Insert product attributes
        if (attributes) {
            for (const attr of parsedAttributes) {
                const { value_id } = attr;
                await pool.query(
                    `INSERT INTO product_attributes (product_id, attribute_value_id) 
                    VALUES ($1, $2)`,
                    [product_id, value_id]
                );
            }
        } 
        else {
            deleteUploadedFiles(req.files);
            return res.status(400).json({ message: "Товар должен содержать хотя бы одну пару атрибут-значение" })
        }

        if (req.files['mainImage']) {
            await pool.query(
                `INSERT INTO product_imgs (product_id, img_url, is_main)
                VALUES ($1, $2, $3)`,
                [product_id, `/images/${req.files['mainImage'][0].filename}`, true]
            );
        }

        if (req.files['images']) {
            for (const img of req.files['images']) {
                await pool.query(
                    `INSERT INTO product_imgs (product_id, img_url, is_main)
                    VALUES ($1, $2, $3)`,
                    [product_id, `/images/${img.filename}`, false]
                );
            }
        }

        res.status(201).json({ 
            message: "Товар успешно создан", 
            product: newProduct.rows[0] 
        });
    }
    catch (error) {
        console.error(error);
        deleteUploadedFiles(req.files);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for getting all products of particular brand
app.get("/brand_products/:brand_id", async (req, res) => {
    try {
        const { brand_id } = req.params;

        const brandProducts = await pool.query(
            `SELECT 
                b.id AS brand_id,
                b.user_id,
                b.brand_name,
                b.brand_img,
                b.brand_description,
                COALESCE(
                    json_agg(
                        CASE 
                            WHEN p.id IS NOT NULL THEN json_build_object(
                                'id', p.id,
                                'product_name', p.product_name,
                                'price', p.price,
                                'category_name', c.category_name,
                                'producer', pr.producer_name,
                                'img_url', pi_main.img_url,
                                'product_images', (
                                    SELECT json_agg(json_build_object('img_url', pi.img_url))
                                    FROM product_imgs pi
                                    WHERE pi.product_id = p.id
                                )
                            )
                        END
                    ) FILTER (WHERE p.id IS NOT NULL), '[]'
                ) AS products
            FROM brands b
            LEFT JOIN products p ON p.brand_name_id = b.id
            LEFT JOIN categories c ON p.category_name_id = c.id
            LEFT JOIN producers pr ON p.producer_id = pr.id
            LEFT JOIN product_imgs pi_main ON p.id = pi_main.product_id AND pi_main.is_main = true
            WHERE b.id = $1
            GROUP BY b.id;
            `,
            [brand_id]
        );

        if (brandProducts.rows.length === 0) {
            return res.status(404).json({ error: "Бренд не нйден" });
        }

        res.status(200).json(brandProducts.rows[0]);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Code 500 (Server error)" });
    }
});

// Route for product deletion by product_id
app.delete("/delete/product", async (req, res) => {
    try {
        const { product_id, product_images } = req.body;

        const deletedProduct = await pool.query(
            `DELETE FROM products WHERE id = $1 RETURNING *;`,
            [product_id]
        );

        if (deletedProduct.rows.length === 0) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        // Deletion of img, if exists in particular product
        if (product_images) {
            product_images.forEach(imgObj => {
                if (imgObj && imgObj.img_url) {
                    const editedPath = imgObj.img_url.replace(/^\/images\//, "");
                    const fullImagePath = path.join(__dirname, "..", "tech-nexus-frontend", "public", "images", editedPath);

                    if (fs.existsSync(fullImagePath)) {
                        fs.unlink(fullImagePath, (err) => {
                            if (err) {
                                console.error(`Error deleting a file: ${fullImagePath}`, err);
                            }
                            else {
                                console.log(`File ${fullImagePath} deleted successfully`);
                            }
                        });
                    }
                }
            });    
        }
        
        res.status(200).json({
            message: "Товар успешно удален",
            deletedProduct: deletedProduct.rows[0]
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