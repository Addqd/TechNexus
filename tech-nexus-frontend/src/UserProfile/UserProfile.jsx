import styles from "./UserProfile.module.css";

export default function UserProfile () {
    return (
        <>

            {/* Sections of choice */}

            <div className={styles.sectionsWrapper}>
                <div className={styles.section}>
                    Профиль
                </div>
                <div className={styles.section}>
                    Заказы
                </div>
                <div className={styles.section}>
                    Купленные товары
                </div>
                <div className={styles.section}>
                    Избранное
                </div>
                <div className={styles.section}>
                    Ваш бренд
                </div>
                <div className={styles.section}>
                    Способ оплаты
                </div>
            </div>

            {/* Components corresponding to choises */}

            {/* Profile */}

            <div className={styles.profileWrapper}>
                <div className={styles.profileContent}>
                    <img src="/images/testImage.jpg" alt="Изображение профиля" />
                    <span>Username</span>
                    <span>Баланс 100</span>
                    <span>Продавец ли?</span>
                    <span>Редактировать профиль</span>
                </div>
            </div>

            {/* Orders */}

            <div className={styles.ordersWrapper}>
                <div className={styles.ordersContent}>
                    <span>Product card goes here</span>
                    <span>Status of the purchase</span>
                    <span>Approximate date of arrival</span>
                </div>
            </div>

            {/* History */}

            <div className={styles.historyWrapper}>
                <div className={styles.historyContent}>
                    <span>Product card goes here</span>
                    <span>Rewiev, if never reviewed: Provide an option to do so</span>
                </div>
            </div>

            {/* Favorites */}

            <div className={styles.favoritesWrapper}>
                <div className={styles.favoritesContent}>
                    <span>Product card goes here</span>
                    <span>Is in stock, if true - it's ammount</span>
                </div>
            </div>

            {/* Brand */}

            <div className={styles.brandWrapper}>
                <div className={styles.brandContent}>
                    <span>Create a brand if not registered</span>
                    <img src="/images/testImage.jpg" alt="Изображение бренда" />
                    <span>Brand name</span>
                    <span>Отзывы клиентов</span>
                    <span>Создать товар</span>
                    <span>Product card goes here, all brand's products</span>
                </div>
            </div>

            {/* Payment method */}
            
            <div className={styles.paymentWrapper}>
                <div className={styles.paymentContent}>
                    <span>Cool looking box like banking card, with registration</span>
                </div>
            </div>

        </>
    );   
}