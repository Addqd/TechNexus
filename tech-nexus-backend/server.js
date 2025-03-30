import express from "express";
import cors from "cors";
import pool from "./db.js";
import bcrypt from "bcrypt";

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// Route to get all products on start page
app.get("/", async (req, res) => {
    try {
        const allProducts = await pool.query(`SELECT 
                                                p.id, 
                                                p.product_name, 
                                                p.producer, 
                                                p.price, 
                                                c.category_name, 
                                                pi.img_url
                                            FROM products p
                                            JOIN brands b ON p.brand_name_id = b.id
                                            JOIN categories c ON p.category_name_id = c.id
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
                                                p.producer,
                                                p.price,
                                                p.description,
                                                b.brand_name,
                                                mc.master_category_name,
                                                c.category_name,
                                                -- Собираем массив характеристик и их значений
                                                COALESCE(json_agg(DISTINCT jsonb_build_object(
                                                    'attribute', a.attribute,
                                                    'value', av.attribute_value
                                                )) FILTER (WHERE a.id IS NOT NULL), '[]') AS attributes,
                                                -- Собираем массив изображений
                                                COALESCE(json_agg(DISTINCT jsonb_build_object(
                                                    'img_url', pi.img_url,
                                                    'is_main', pi.is_main
                                                )) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images
                                                FROM products p
                                                JOIN brands b ON p.brand_name_id = b.id
                                                JOIN categories c ON p.category_name_id = c.id
                                                JOIN master_categories mc ON c.master_category_name_id = mc.id
                                                LEFT JOIN product_attributes pa ON p.id = pa.product_id -- Соединяем товар и атрибуты
                                                LEFT JOIN attribute_values av ON pa.attribute_value_id = av.id -- Достаём значения атрибутов
                                                LEFT JOIN attributes a ON av.attribute_name_id = a.id -- Получаем название атрибута
                                                LEFT JOIN product_imgs pi ON p.id = pi.product_id
                                                WHERE p.id = $1
                                                GROUP BY p.id, b.brand_name, mc.master_category_name, c.category_name;`, [id]);

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
        const forbiddenChars = /["'`;<>\\\n\r\t\b\f]|\/\*|\*\//;
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

app.listen(8000, () => {
    console.log("Server is listenning on port 8000");
});