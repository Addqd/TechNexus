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
                    Баланс
                </div>
            </div>

            {/* Components corresponding to choises */}

            <div className={styles.profileWrapper}>
                <div className={styles.profileContent}>
                    <img src="/images/testImage.jpg" alt="Изображение профиля" />
                    <span>Username</span>
                    
                </div>
            </div>
        </>
    );   
}