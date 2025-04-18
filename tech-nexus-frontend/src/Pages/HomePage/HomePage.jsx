import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import ProductCard from "../../ProductCard/ProductCard.jsx";
import arrowRight from "../../assets/arrowRight.svg";
import arrowLeft from "../../assets/arrowLeft.svg";
import { useState, useEffect } from "react";

export default function HomePage() {

    // Product card generation according to data in db. Loads on mount of this component,  
    // meaning when main page loads we see all products in there

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const PRODUCTS_PER_PAGE = 36;

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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIdx = startIdx + PRODUCTS_PER_PAGE;
    const productsToDisplay = products.slice(startIdx, endIdx);

    return(
        <main className={styles.homePage}>
            {productsToDisplay.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className={styles.linkWrapper}>
                    <ProductCard 
                        imgPath={product.img_url || "./images/testImage.jpg"}
                        itemName={product.product_name} 
                        itemProducer={product.producer} 
                        itemCategory={product.category_name} 
                        itemPrice={product.price}
                    />
                </Link>
            ))}
            <div className={styles.pageCounter}>
                <button className={styles.arrowBtn} onClick={handlePrevPage} disabled={currentPage === 1}>
                    <img 
                        src={arrowLeft} 
                        alt="На страницу назад" 
                    />
                </button>
                <span>{currentPage}/{totalPages}</span>
                <button className={styles.arrowBtn} onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <img 
                        src={arrowRight} 
                        alt="На страницу впред" 
                    />
                </button>
            </div>
        </main>
    );
}