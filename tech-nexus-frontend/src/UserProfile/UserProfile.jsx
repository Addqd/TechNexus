import styles from "./UserProfile.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function UserProfile () {

    const navigate = useNavigate();
    const { user_id } = useParams();

    const [selectedSection, setSelectedSection] = useState("profile");
    const [fullUserProfile, setFullUserProfile] = useState(null);
    const [isWillingToEditBrand, setIsWillingToEditBrand] = useState(false);
    const [isWillingToEditProfile, setIsWillingToEditProfile] = useState(false);
    const [isWillingToDeleteBrand, setIsWillingToDeleteBrand] = useState(false);
    const [isEditFormChanged, setIsEditFormChanged] = useState(false);
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");

    const [imgData, setImgData] = useState({
        fileName: "/images/testImage.jpg",
        preview: null,
    });

    const [errors, setErrors] = useState({
        brandName: false
    });

    // maxLength for text area
    const maxLength = 400;

    useEffect(() => {
        const isUserLoggedIn = Cookies.get("isUserLoggedIn");

        if (!isUserLoggedIn) {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try{
                const response = await fetch(`http://localhost:8000/profile/${user_id}`);

                if(!response.ok){
                    throw new Erorr("Fetch wasn't ok");
                }
                const data = await response.json();
                
                setFullUserProfile(data);
                setBrandName(data.brand_name);
                setDescription(data.brand_description ? data.brand_description : "");
                setImgData({
                    fileName: data.brand_img,
                    preview: data.brand_img
                });

            }
            catch(error){
                console.error(error);
            }
        }

        fetchUserProfile();
    }, []);

    // Temoral URL for img path cleaning on unmount
    useEffect(() => {
        return () => {
            if (imgData.preview) {
                URL.revokeObjectURL(imgData.preview);
            }
        };
    }, []);

    useEffect(() => {
       if (!fullUserProfile) return;
       
        const nameChanged = brandName !== fullUserProfile.brand_name;
        const descChanged = description !== fullUserProfile.brand_description;
        const imgChanged = imgData.fileName !== fullUserProfile.brand_img;

        setIsEditFormChanged(nameChanged || descChanged || imgChanged);
    }, [brandName, description, imgData, fullUserProfile]);

    // Handle file change when uploading an image
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setImgData({
                fileName: file.name,
                preview: objectURL
            });
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleBrandNameChange = (e) => {
        setBrandName(e.target.value);
    };

    // Handle register brand form submit
    const handleCreateBrandFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("brand_name", e.target.brand_name.value.trim());
        formData.append("brand_description", e.target.brand_description.value.trim());
        if (imgData.preview) {
            formData.append("brand_img", e.target.brand_img.files[0]);
        }

        try {
            const response = await fetch("http://localhost:8000/create/brand", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                window.alert(data.message);
                window.location.reload();
                setIsWillingToEditBrand(false);
            }
            else {
                const errorData = await response.json();
                window.alert(errorData.error);
            }

            /* setIsWillingToEditBrand(false); */
        }
        catch (error) {
            console.error(error);
        }

        const newErrors = {
            brandName: !e.target.brand_name.value.trim(),
        };

        setErrors(newErrors);

    }

    const handleEditBrandFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("brand_name", e.target.brand_name.value.trim());
        formData.append("brand_description", e.target.brand_description.value.trim());
        if (imgData.preview) {
            formData.append("brand_img", e.target.brand_img.files[0]);
        }

        try {
            const response = await fetch("http://localhost:8000/update/brand", {
                method: "PUT",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                if (
                    ((formData.get("brand_name") === data.brand_name)) &&
                    ((formData.get("brand_description") === data.brand_description)) &&
                    ((formData.get("brand_img") === data.brand_img))
                ) {
                    window.alert(data.error);
                }
                else {
                    window.alert(data.message);
                    window.location.reload();
                }
            }
            else {
                const errorData = await response.json();
                window.alert(errorData.error);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleDeleteBrand = async () => {
        const deleteData = {
            user_id: user_id,
            brand_img: fullUserProfile.brand_img
        }

        try {
            const response = await fetch("http://localhost:8000/delete/brand", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteData)
            });

            if (response.ok) {
                const data = await response.json();
                window.alert(data.message);
                window.location.reload();
            }
            else {
                const errorData = await response.json();
                window.alert(errorData.error);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

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
                        <div className={styles.profile}>
                            <div className={styles.mainPicWrapper}>
                            <img className={styles.mainPic} src={fullUserProfile.profile_img || `/images/testImage.jpg`} alt="Изображение профиля" /> 
                            </div>
                            <span>{fullUserProfile.username}</span>
                            <span>Баланс: {fullUserProfile.balance}₽</span> 
                            <span>Бренд: {fullUserProfile.is_seller ? fullUserProfile.brand_name : "Нет бренда"}</span>
                            <span>Адресс доставки: {fullUserProfile.shipping_address === null ? "Не указан" : fullUserProfile.shipping_address}</span>
                            <button>Редактировать профиль</button>
                        </div>
                        
                    </>
                );
            case "orders": 
                return (
                    <>
                        <div className={styles.orders}>
                            <span>Product card goes here</span>
                            <span>Status of the purchase</span>
                            <span>Approximate date of arrival</span>
                        </div>
                    </>
                );
            case "history":
                return (
                    <>
                        <div className={styles.history}>
                            <span>Product card goes here</span>
                            <span>Rewiev, if never reviewed: Provide an option to do so</span>
                        </div>
                    </>
                );
            case "favorites":
                return (
                    <>
                        <div className={styles.favorites}>
                            <span>Product card goes here</span>
                            <span>Is in stock, if true - it's ammount</span>
                        </div>
                    </>
                );
            case "brand": 

                if (!fullUserProfile.is_seller) {
                    return (
                        <div>
                            {!isWillingToEditBrand ? (
                                <div className={styles.notSeller}>
                                    <span>Вы не являетесь продавцом.</span>
                                    <span>Хотите зарегистрировать свой бренд?</span>
                                    <button onClick={() => setIsWillingToEditBrand(true)}>Зарегистрировать бренд</button> 
                                </div>
                            ) : (
                                <form className={styles.brandAndProfileForms} onSubmit={handleCreateBrandFormSubmit}>
                                    <button className={styles.returnBackBtn} onClick={() => setIsWillingToEditBrand(false)}>Назад</button>
                                    <span>Cоздание бренда</span>
            
                                    <span>Изображение бренда</span>

                                    <div style={{ userSelect: "none" }}>
                                        <img className={styles.mainPic} src={imgData.preview || `/images/testImage.jpg`} alt="Превью изображеня бренда"/>
                                    </div>
                                    <span>{imgData.fileName === "/images/testImage.jpg" ? "Файл не выбран" : imgData.fileName}</span>
                                    <label className={styles.fileUploadLabel}>
                                        Выбрать изображение
                                        <input 
                                            type="file"
                                            name="brand_img"
                                            onChange={handleFileChange}
                                            className={styles.hiddenFileInput} 
                                        />
                                    </label>

                                    <span>Название бренда</span>
                                    <input 
                                        type="text" 
                                        name="brand_name" 
                                        placeholder="Введите название бренда"
                                        onChange={() => setErrors((prev) => ({ ...prev, brandName: false }))}
                                        className={errors.brandName ? styles.errorBorder : ""}
                                    />
                                    <span>Описание бренда</span>
                                    <div className={styles.textareaContainer}>
                                        <textarea 
                                            name="brand_description"
                                            placeholder="Введите описание бренда"
                                            rows='5'
                                            cols='50'
                                            maxLength={maxLength}
                                            value={description}
                                            onChange={handleDescriptionChange}
                                        />
                                        <span className={styles.charCount}>
                                            {description.length}/{maxLength}
                                        </span>    
                                    </div>
                                    <button className={styles.createBrandButton} type="submit">Создать бренд</button>
                                </form>   
                            )}
                        </div>
                    )
                }
                
                return (
                    <>
                        <div>
                            {!isWillingToEditBrand ? (
                                <div className={styles.brand}>
                                    <div className={styles.mainPicWrapper}>
                                        <img className={styles.mainPic} src={fullUserProfile.brand_img || `/images/testImage.jpg`} alt="Изображение бренда" />
                                    </div>
                                    <span>{fullUserProfile.brand_name}</span>
                                    <span>Описание бренда</span>
                                    <span className={styles.brandDescription}>{fullUserProfile.brand_description}</span>
                                    <div className={styles.brandActionsWrapper}>
                                        <button>Заказы клиентов</button>
                                        <button>Товары бренда</button>
                                        <button>Создать товар</button>
                                        <button onClick={() => setIsWillingToEditBrand(true)}>Редактировать бренд</button>
                                        <button onClick={() => setIsWillingToDeleteBrand(true)}>Удалить бренд</button>
                                    </div>
                                    
                                    {isWillingToDeleteBrand && 
                                        <div className={styles.deleteBrandModal}>
                                            <div className={styles.deleteBrandModalContent}>
                                                <span>Вы действительно хотите удалить свой бренд <b>{fullUserProfile.brand_name}</b>?</span>
                                                <span>После удаления все товары созданные вашим брендом будут удалены.</span>
                                                <div className={styles.deleteBrandModalActionsWrapper}>
                                                    <button onClick={() => setIsWillingToDeleteBrand(false)}>Отмена</button>
                                                    <button onClick={handleDeleteBrand}>Удалить бренд</button> 
                                                </div>    
                                            </div>
                                        </div>
                                    }

                                </div>   
                            ) : (
                                <form className={styles.brandAndProfileForms} onSubmit={handleEditBrandFormSubmit}>
                                    <button className={styles.returnBackBtn} onClick={() => setIsWillingToEditBrand(false)}>Назад</button>
                                    <span>Редактирование бренда</span>
            
                                    <span>Изображение бренда</span>

                                    <div style={{ userSelect: "none" }}>
                                        <img className={styles.mainPic} src={imgData.preview || `/images/testImage.jpg`} alt="Превью изображеня бренда"/>
                                    </div>
                                    <span>{imgData.fileName === "/images/testImage.jpg" ? "Файл не выбран" : imgData.fileName}</span>
                                    <label className={styles.fileUploadLabel}>
                                        Выбрать изображение
                                        <input 
                                            type="file"
                                            name="brand_img"
                                            onChange={handleFileChange}
                                            className={styles.hiddenFileInput} 
                                        />
                                    </label>

                                    <span>Название бренда</span>
                                    <input 
                                        type="text" 
                                        name="brand_name" 
                                        placeholder="Введите название бренда"
                                        value={brandName}
                                        onChange={handleBrandNameChange}
                                        className={errors.brandName ? styles.errorBorder : ""}
                                    />
                                    <span>Описание бренда</span>
                                    <div className={styles.textareaContainer}>
                                        <textarea 
                                            name="brand_description"
                                            placeholder="Введите описание бренда"
                                            rows='5'
                                            cols='50'
                                            maxLength={maxLength}
                                            value={description}
                                            onChange={handleDescriptionChange}
                                        />
                                        <span className={styles.charCount}>
                                            {description.length}/{maxLength}
                                        </span>    
                                    </div>
                                    <button 
                                        className={`${styles.createBrandButton} ${!isEditFormChanged ? styles.disabledButton : ""}`}
                                        type="submit"
                                        disabled={!isEditFormChanged}
                                    >
                                        Изменить бренд
                                    </button>
                                </form>   
                            )}
                        </div>
                    </>
                );
            case "payment":
                return (
                    <>
                        <div className={styles.payment}>
                            <span>Cool looking box like banking card, with registration</span>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (!fullUserProfile) {
        return <div>Loading...</div>;
    }

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
                            className={`${styles.optionWrapper} ${selectedSection === section.id ? styles.active : ""}`}
                        >
                            {renderSection(section.id)}
                        </div>
                    ))}
                </div>

            </div>
        </>
    );   
}