import styles from "./UserProfile.module.css";
import { useState } from "react";

export default function UserProfile () {

    const [selectedSection, setSelectedSection] = useState("profile");

    const sections = [
        {id: "profile", label: "Профиль"},
        {id: "orders", label: "Заказы"},
        {id: "history", label: "Купленные товары"},
        {id: "favorites", label: "Избранное"},
        {id: "brand", label: "Ваш бренд"},
        {id: "payment", label: "Способ оплаты"}
    ];

    const renderSection = (section) => {
        switch (section) {
            case "profile":
                return (
                    <>
                        <div className={styles.mainPicWrapper}>
                           <img className={styles.mainPic} src="/images/testImage.jpg" alt="Изображение профиля" /> 
                        </div>
                        <span>Username</span>
                        <span>Баланс 100</span>
                        <span>Продавец ли?</span>
                        <span>Адресс доставки</span>
                        <span>Редактировать профиль</span>
                    </>
                );
            case "orders": 
                return (
                    <>
                        <span>Product card goes here</span>
                        <span>Status of the purchase</span>
                        <span>Approximate date of arrival</span>
                    </>
                );
            case "history":
                return (
                    <>
                        <span>Product card goes here</span>
                        <span>Rewiev, if never reviewed: Provide an option to do so</span>
                    </>
                );
            case "favorites":
                return (
                    <>
                        <span>Product card goes here</span>
                        <span>Is in stock, if true - it's ammount</span>
                    </>
                );
            case "brand": 
                return (
                    <>
                        <span>Create a brand if not registered</span>
                        <div className={styles.mainPicWrapper}>
                            <img className={styles.mainPic} src="/images/testImage.jpg" alt="Изображение бренда" />
                        </div>
                        <span>Brand name</span>
                        <span>Отзывы клиентов</span>
                        <span>Создать товар</span>
                        <span>Product card goes here, all brand's products</span>
                    </>
                );
            case "payment":
                return (
                    <>
                        <span>Cool looking box like banking card, with registration</span>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.userProfileWrapper}>

                {/* Sections sidebar */}

                <div className={styles.sectionsWrapper}>
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className={styles.section}
                            onClick={() => setSelectedSection(section.id)}
                        >
                            {section.label}
                        </div>
                    ))}
                </div>

                {/* Selected section */}

                <div className={styles.renderArea}>
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className={`${styles.optionWrapper} ${styles[section.id]} ${selectedSection === section.id ? styles.active : ""}`}
                        >
                            {renderSection(section.id)}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );   
}