import styles from "./BrandProducts.module.css";
import ProductCard from "../ProductCard/ProductCard.jsx";
import Notification from "../Notification/Notification.jsx";
import arrowRight from "../assets/arrowRight.svg";
import arrowLeft from "../assets/arrowLeft.svg";
import crossInCircle from "../assets/cross-in-circle.svg";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function BrandProducts() { 

    const [currentPage, setCurrentPage] = useState(1);
    const [brandProductsData, setBrandProductsData] = useState(null);
    const [doesUserOwnBrand, setDoesUserOwnBrand] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [showFailNotification, setShowFailNotification] = useState(false);
    const [failMsg, setFailMsg] = useState("");
    const [productToDelete, setProductToDelete] = useState(null);

    const { brand_id } = useParams();

    const PRODUCTS_PER_PAGE = 36;

    useEffect(() => {
        const fetchBrandProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/brand_products/${brand_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBrandProductsData(data);
                    setDoesUserOwnBrand(data.user_id === Number(Cookies.get("userId")));
                }
                else {
                    const errorData = await response.json();
                    console.error(errorData.error || errorData.message);
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        fetchBrandProducts();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    if (!brandProductsData || !Array.isArray(brandProductsData.products)) {
        return (<div>Загрузка...</div>);
    }

    const totalPages = Math.ceil(brandProductsData.products.length / PRODUCTS_PER_PAGE);
    const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIdx = startIdx + PRODUCTS_PER_PAGE;
    const productsToDisplay = brandProductsData.products.slice(startIdx, endIdx);

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

    // Remove selected product
    const handleRemoveProduct = async (product) => {
        const deleteData = {
            product_id: product.id,
            product_images: product.product_images
        };

        console.log(deleteData.product_id);

        try {
            const response = await fetch("http://localhost:8000/delete/product", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteData)
            });

            if (response.ok) {
                const data = await response.json();
                setShowSuccessNotification(true);
                setSuccessMsg(data.message);
            }

            else {
                const errorData = await response.json();
                setShowFailNotification(true);
                setFailMsg(errorData.error || errorData.message);
            }
        }
        catch (error) {
            console.error(error);
        }
    };

    return(
            <div className={styles.BrandProductsWrapper}>
                <div className={styles.brandInfo}>
                    <div className={styles.mainPicWrapper}>
                        <img className={styles.mainPic}
                            src={brandProductsData.brand_img || `/images/testImage.jpg`} 
                            alt="Изображение бренда" 
                        />
                    </div>
                    
                    <span>{brandProductsData.brand_name}</span>
                    <span className={styles.brandDescription}>{brandProductsData.brand_description || "Описание отсутствует"}</span>
                </div>
                <div className={styles.brandProductsProducts}>
                    {brandProductsData.products.length === 0 && 
                        <div className={styles.noProductsContainer}>
                            <span className={styles.noProductsMsg}>У данного бренда пока нет товаров</span>
                        </div>
                    }
                    {brandProductsData.products.map((product) => (
                        <div style={{"position": "relative"}} key={product.id}>
                            <Link to={`/product/${product.id}`} className={styles.linkWrapper}>
                                    <ProductCard 
                                        imgPath={product.img_url || "/images/testImage.jpg"} 
                                        itemName={product.product_name} 
                                        itemProducer={product.producer} 
                                        itemCategory={product.category_name} 
                                        itemPrice={product.price}
                                    />
                            </Link>
                            {doesUserOwnBrand && (
                                <img 
                                    src={crossInCircle} 
                                    alt="Удалить"
                                    className={styles.removeIcon}
                                    onClick={() => setProductToDelete(product)} 
                                />        
                            )}
                            {productToDelete  &&
                                <div className={styles.deleteBrandAndProfileModal}>
                                    <div className={styles.deleteBrandAndProfileModalContent}>
                                        <span>Вы действительно хотите удалить этот товар?</span>
                                        <span>После удаления все связанные с ним данные будут недоступны.</span>
                                        <div className={styles.deleteBrandAndProfileModalActionsWrapper}>
                                            <button onClick={() => {console.log(productToDelete.id); setProductToDelete(null)}}>Отмена</button>
                                            <button onClick={() => handleRemoveProduct(productToDelete)}>Удалить продукт</button> 
                                        </div>    
                                    </div>
                                </div>  
                            }    
                        </div>
                    ))}
                    {productsToDisplay.length > 0 &&
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
                    }
                </div>

                

                {showSuccessNotification &&
                    <Notification 
                        message={successMsg}
                        onClose={() => {
                            setProductToDelete(null);
                            setShowSuccessNotification(false);
                            setSuccessMsg("");
                            window.location.reload();
                        }}
                    />
                }

                {showFailNotification && 
                    <Notification 
                        message={failMsg}
                        onClose={() => {
                            setShowFailNotification(false);
                            setFailMsg("");
                        }}
                    />    
                }
                
            </div>
    );
}