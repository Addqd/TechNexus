import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import ProductCard from "../../ProductCard/ProductCard.jsx";
import { useState, useEffect } from "react";

export default function HomePage() {

    // Product card generation according to data in db. Loads on mount of this component,  
    // meaning when main page loads we see all products in there

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProdcuts = async () => {
            try {
               const response = await fetch("http://localhost:8000/");
               if (!response.ok) {
                    throw new Erorr(`Http error: ${response.status}`);
               }
               const data = await response.json();
               setProducts(data);
            }   
            catch (error) {
                console.error(error);
            }
        };
        
        fetchProdcuts();
    }, []);

    /* 
    This should lead to /product/:id 
    Where :id is fetched from products stateful variable
    */

    return(
        <main className={styles.homePage}>
            {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                    <ProductCard 
                        imgPath={product.img_url || "./images/testImage.jpg"}
                        itemName={product.product_name} 
                        itemProducer={product.producer} 
                        itemCategory={product.category_name} 
                        itemPrice={product.price}
                    />
                </Link>
            ))}
        </main>
    );
}