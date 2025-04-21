import styles from "./ProductCard.module.css";

export default function ProductCard({ imgPath, itemName, itemProducer, itemCategory, itemPrice }){

    return(
        <>
            <div className={styles.cardBox}>
                <img className={styles.cardImg} src={imgPath} alt={itemName} />
                <div className={styles.textContainer}>
                    <p className={styles.itemPriceText}>{itemPrice} ₽</p>
                    <p className={styles.itemNameText}>{itemName}</p>
                    <p className={styles.itemProducerText}>{itemProducer}</p>
                    <p className={styles.itemCategoryText}>{itemCategory}</p>
                    <button className={styles.addToCartButton}>Купить</button>
                </div>
            </div>
        </>
    );
}