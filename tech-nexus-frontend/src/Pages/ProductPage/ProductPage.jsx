import styles from "./ProductPage.module.css";
import ImageGallery from "../../ImageGallery/ImageGallery.jsx";
import FullCharacteristicsTable from "../../CharacteristicsTables/FullCharacteristicsTable/FullCharacteristicsTable.jsx";
import SmallCharacteristicsTable from "../../CharacteristicsTables/SmallCharacteristicsTable/SmallCharacteristicsTable.jsx";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

                    {/*
                        1. Implement login and registration functions connected to server as well <--
                        2. Create user menu when logged in. 
                        3. Create personal cabinet with data edit function.

                        Change collor of arrows in thumbnails on scroll btns
                        (deferred)
                        
                        Create btns to scroll imgs like in yandex market inside main img
                        (deferred)

                        Also make an a fixed height and width box inside of which
                        thumbnail will render with it's object-fit: contain
                        (deferred)
                     */}

                    <ImageGallery thumbnails={product.images.map(img => img.img_url)}/>

                    <div className={styles.description}>
                        <h4>{product.product_name}</h4>
                        <div className={styles.brandAndProducer}>
                            <p>{product.brand_name}</p>
                            <p>{product.producer}</p>
                        </div>

                        <SmallCharacteristicsTable 
                            characteristics={product.attributes.map(attr => attr.attribute)} 
                            values={product.attributes.map(attr => attr.value)}
                        />

                        <button className={styles.scrollToFullDescrButton} onClick={handleScrollToFullDescr}>
                            Полное описание 
                        </button>

                    </div>
                    
                    {/* Very ugly. But ok for now.
                    Maybe reposition this under SmallDescr? 
                    However, more content will be added inside 
                    this container.*/}

                    <div className={styles.buyToCart}>
                        <p>{product.price}</p>
                        <div className={styles.buyToCartBtns}>
                            <button>В корзину</button>
                            <button>Купить</button>
                        </div>
                    </div>
                    <div className={styles.fullDescrAndReviewsWrapper}>
                        <div className={styles.fullDescr} ref={fullDescrRef}>
                            <h4>Полное описание товара</h4>
                             <div className={styles.descText}>
                                <p>{product.description}</p>
                            </div>  
                            <h4>Все характеристики товара</h4>
                            
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