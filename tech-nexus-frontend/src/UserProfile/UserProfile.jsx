import styles from "./UserProfile.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function UserProfile () {

    const navigate = useNavigate();

    const [selectedSection, setSelectedSection] = useState("profile");

    useEffect(() => {
        const isUserLoggedIn = Cookies.get("isUserLoggedIn");

        if (!isUserLoggedIn) {
            navigate("/");
        }
    }, []);

    const sections = [
        {id: "profile", label: "Профиль"},
        {id: "orders", label: "Заказы"},
        {id: "history", label: "Купленные товары"},
        {id: "favorites", label: "Избранное"},
        {id: "brand", label: "Ваш бренд"},
        {id: "payment", label: "Способ оплаты"}
    ];

    const handleGoBack = () => {
        navigate(-1);
    };

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

    /* IMPROVE PROTECTION. 
       Add check on wether isUserLoggedIn in cookies or not AT ALL to EVEN render the component 
       Why is it nececcery? Basicaly, when app will be deployed on server
       IT IS (I GUESS) possible, that when user is pressing on btn in his browser to go back
       (tiny arrow close to address bar) IT ACTUALY CAN let him back in his profile, even
       IF HE IS NOT LOGGED IN. So that's potential seccurity threat.*/

    return (
        <>
            <div className={styles.userProfileWrapper}>

                {/* Sections sidebar */}

                <div className={styles.sectionsWrapper}>
                    <button className={styles.returnBackBtn} onClick={handleGoBack}>
                        Назад
                    </button>
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className={`${styles.section} ${selectedSection === section.id ? styles.activeSection : ""}`}
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