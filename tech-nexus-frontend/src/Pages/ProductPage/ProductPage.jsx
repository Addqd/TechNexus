import styles from "./ProductPage.module.css";
import ImageGallery from "../../ImageGallery/ImageGallery.jsx";
import FullCharacteristicsTable from "../../CharacteristicsTables/FullCharacteristicsTable/FullCharacteristicsTable.jsx";
import SmallCharacteristicsTable from "../../CharacteristicsTables/SmallCharacteristicsTable/SmallCharacteristicsTable.jsx";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function ProductPage(){

    const navigate = useNavigate();

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const fullDescrRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const response = await fetch(`http://localhost:8000/products/${id}`);
                console.log(response);
                if(!response.ok){
                    throw new Erorr("Fetch wasn't ok");
                }
                const data = await response.json();

                data.images.sort((a,b) => b.is_main - a.is_main);

                setProduct(data);
            }
            catch(error){
                console.error(error);
            }
        };

        
        fetchProduct();
    }, []);

    /* console.log(product); */

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleScrollToFullDescr = () => {
        if(fullDescrRef.current){
            const elementTop = fullDescrRef.current.getBoundingClientRect().top + window.scrollY;
            const offset = window.innerHeight / 2 - window.innerHeight * 0.20;
            window.scrollTo({top: elementTop - offset, behavior: "smooth"});
        };
    };

    /* I need to resize elements to be bigger, 
    they all are kinda small for now. */

    if(!product){
        return <p>Добавить сюда загрузку</p>;
    };

    return(
        <>
            <div className={styles.productContent}>
                <div className={styles.categories}>
                    <button className={styles.returnBackBtn} onClick={handleGoBack}>
                        Назад
                    </button>
                    <p><i>{product.master_category_name} | {product.category_name}</i></p>
                </div>
                <div className={styles.productMain}>

                    <ImageGallery thumbnails={product.images.map(img => img.img_url)}/>

                    <div className={styles.description}>
                        <span className={styles.customHeader}>{product.product_name}</span>
                        <div className={styles.brandAndProducer}>
                            <Link to={`/brand_products/${product.brand_id}`} className={styles.linkBtn}>
                                {product.brand_name}  
                            </Link>
                            <p>{product.producer}</p>
                        </div>

                        <SmallCharacteristicsTable 
                            characteristics={product.attributes.map(attr => attr.attribute)} 
                            values={product.attributes.map(attr => attr.value)}
                        />

                        <button className={styles.scrollToFullDescrButton} onClick={handleScrollToFullDescr}>
                            Полное описание 
                        </button>

                        <div className={styles.buyToCart}>
                            <span>{product.price} ₽</span>
                            <button>Купить</button>
                        </div>
                    </div>

                    <div className={styles.fullDescrAndReviewsWrapper}>
                        <div className={styles.fullDescr} ref={fullDescrRef}>
                            <span className={styles.customHeader}>Полное описание товара</span>
                            
                            <span className={styles.customDescr}>{product.description}</span>
                            
                            <span className={styles.customHeader}>Все характеристики товара</span>
                            
                            <FullCharacteristicsTable 
                                characteristics={product.attributes.map(attr => attr.attribute)} 
                                values={product.attributes.map(attr => attr.value)}
                            />

                        </div>
                        <div className={styles.reviews}>
                            <h4>Отзывы - 5 звездочек из 5</h4><br />
                            <p>Геральт Из Ривии</p>
                            <p>5 звездочек из 5</p>
                            <img src="/images/cat4.jpg"/>
                            <pre>
                                Достоинства: Отличный Кот 👍 <br />
                                Недостатки: Слишком хороший <br />
                                Комментарий: Я счастлив <br />
                            </pre>
                        </div> 
                    </div>
                </div>
            </div>  
        </>
    );
}