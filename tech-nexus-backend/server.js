import express from "express";
import cors from "cors";
import pool from "./db.js";

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
        res.status(500).json({error: 'Code 500 (Server error)'});
    }
    
});



app.listen(8000, () => {
    console.log("Server is listenning on port 8000");
});