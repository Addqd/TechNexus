import styles from "./UserProfile.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReturnBackBtn from "../ReturnBackBtn/ReturnBackBtn";
import Cookies from "js-cookie";

// Img type check on server and on client
// ADD WHAT CHAT GPT SUGGESTED IN HANDLEFILECHANGE AND INTO EVERY INPUT
// SHORTEN AMMOUNT OF EXTENSIONS TO accept="image/jpeg, image/png, image/webp, image/svg+xml"
export default function UserProfile () {

    const navigate = useNavigate();
    const { user_id } = useParams();

    const [selectedSection, setSelectedSection] = useState("profile");
    const [fullUserProfile, setFullUserProfile] = useState(null);
    const [isWillingToEditBrand, setIsWillingToEditBrand] = useState(false);
    const [isWillingToEditProfile, setIsWillingToEditProfile] = useState(false);
    const [isWillingToDeleteBrand, setIsWillingToDeleteBrand] = useState(false);
    const [isWillingToDeleteProfile, setIsWillingToDeleteProfile] = useState(false);
    const [isBrandEditFormChanged, setIsBrandEditFormChanged] = useState(false);
    const [isProfileEditFormChanged, setIsProfileEditFormChanged] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [shippingAddress, setShippingAddress] = useState("");
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");

    const [profileImgData, setProfileImgData] = useState({
        fileName: "/images/testImage.jpg",
        preview: null
    });

    const [brandImgData, setBrandImgData] = useState({
        fileName: "/images/testImage.jpg",
        preview: null
    });

    const [brandErrors, setBrandErrors] = useState({
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
        const userIdFromCookie = Cookies.get("userId");

        if (!userIdFromCookie) {
            return;
        }

        const fetchUserProfile = async () => {
            try{
                const response = await fetch(`http://localhost:8000/profile/${user_id}`);

                if(!response.ok){
                    throw new Error("Fetch wasn't ok");
                }
                const data = await response.json();
                
                setFullUserProfile(data);
                setUsername(data.username);
                setEmail(data.email);
                setShippingAddress(data.shipping_address);
                setPassword(data.password);
                setBrandName(data.brand_name);
                setDescription(data.brand_description ? data.brand_description : "");
                setProfileImgData({
                    fileName: data.profile_img,
                    preview: data.profile_img
                });
                setBrandImgData({
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
            if (brandImgData.preview) {
                URL.revokeObjectURL(brandImgData.preview);
            }
        };
    }, []);

    // Check if any of the prpile edit form fields have changed
    useEffect(() => {
        if (!fullUserProfile) return;

        const usernameChanged = username !== fullUserProfile.username;
        const emailChanged = email !== fullUserProfile.email;
        const passwordChanged = password !== fullUserProfile.password;
        const shippingAddressChanged = shippingAddress !== fullUserProfile.shipping_address;
        const profileImgChanged = profileImgData.fileName !== fullUserProfile.profile_img;

        setIsProfileEditFormChanged(usernameChanged || emailChanged || passwordChanged || shippingAddressChanged || profileImgChanged);
    }, [username, email, password, shippingAddress, profileImgData]);

    // Check if any of the brand edit form fields have changed
    useEffect(() => {
       if (!fullUserProfile) return;
       
        const nameChanged = brandName !== fullUserProfile.brand_name;
        const descChanged = description !== fullUserProfile.brand_description;
        const brandImgChanged = brandImgData.fileName !== fullUserProfile.brand_img;

        setIsBrandEditFormChanged(nameChanged || descChanged || brandImgChanged);
    }, [brandName, description, brandImgData]);

    // Handle profile file change when uploading an image
    const handleProfileFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setProfileImgData({
                fileName: file.name,
                preview: objectURL
            });
        }
    };

    // Handle brand file change when uploading an image
    const handleBrandFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectURL = URL.createObjectURL(file);
            setBrandImgData({
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

    // Handle edit profile form submit
    const handleEditProfileFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("username", e.target.username.value.trim());
        formData.append("email", e.target.email.value.trim());
        formData.append("password", e.target.password.value.trim());
        formData.append("old_password", e.target.current_password.value.trim());
        formData.append("shipping_address", e.target.shipping_address.value.trim());
        if (profileImgData.preview) {
            formData.append("profile_img", e.target.profile_img.files[0]);
        }

        try {
            const response = await fetch("http://localhost:8000/update/profile", {
                method: "PUT",
                body: formData
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

    // Handle delete profile
    const handleDeleteProfile = async () => {
        const deleteData = {
            user_id: user_id,
            profile_img: fullUserProfile.profile_img,
            brand_img: fullUserProfile.brand_img
        };

        try {
            const response = await fetch("http://localhost:8000/delete/profile", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deleteData)
            });

            if (response.ok) {
                const data = await response.json();
                window.alert(data.message);
                Cookies.remove("isUserLoggedIn");
                Cookies.remove("userId");
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
    };

    // Handle register brand form submit
    const handleCreateBrandFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("brand_name", e.target.brand_name.value.trim());
        formData.append("brand_description", e.target.brand_description.value.trim());
        if (brandImgData.preview) {
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

        }
        catch (error) {
            console.error(error);
        }

        const newBrandErrors = {
            brandName: !e.target.brand_name.value.trim(),
        };

        setBrandErrors(newBrandErrors);

    }

    // Handle edit brand form submit
    const handleEditBrandFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("user_id", user_id);
        formData.append("brand_name", e.target.brand_name.value.trim());
        formData.append("brand_description", e.target.brand_description.value.trim());
        if (brandImgData.preview) {
            formData.append("brand_img", e.target.brand_img.files[0]);
        }

        try {
            const response = await fetch("http://localhost:8000/update/brand", {
                method: "PUT",
                body: formData
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

    const renderSection = (section) => {
        switch (section) {
            case "profile":
                return (
                    <>
                    <div>
                        {!isWillingToEditProfile ? (
                            <div className={styles.profile}>
                                <div className={styles.mainPicWrapper}>
                                <img className={styles.mainPic} src={fullUserProfile.profile_img || `/images/testImage.jpg`} alt="Изображение профиля" /> 
                                </div>
                                <span>{fullUserProfile.username}</span>
                                <span>Баланс: {fullUserProfile.balance}₽</span> 
                                <span>Бренд: {fullUserProfile.is_seller ? fullUserProfile.brand_name : "Нет бренда"}</span>
                                <span>Адресс доставки: {fullUserProfile.shipping_address === null ? "Не указан" : fullUserProfile.shipping_address}</span>
                                <button onClick={() => setIsWillingToEditProfile(true)}>Редактировать профиль</button>
                                <button onClick={() => setIsWillingToDeleteProfile(true)}>Удалить профиль</button>
                                
                                {isWillingToDeleteProfile && 
                                    <div className={styles.deleteBrandAndProfileModal}>
                                        <div className={styles.deleteBrandAndProfileModalContent}>
                                            <span>Вы действительно хотите удалить свой профиль, <b>{fullUserProfile.username}</b>?</span>
                                            <span>После удаления все связанные с ним данные будут недоступны.</span>
                                            <div className={styles.deleteBrandAndProfileModalActionsWrapper}>
                                                <button onClick={() => setIsWillingToDeleteProfile(false)}>Отмена</button>
                                                <button onClick={handleDeleteProfile}>Удалить профиль</button> 
                                            </div>    
                                        </div>
                                    </div>
                                }
                            </div>
                        ) : (
                            <form className={styles.brandAndProfileForms} onSubmit={handleEditProfileFormSubmit}>
                                <button className={styles.returnBackBtn} onClick={() => setIsWillingToEditProfile(false)}>Назад</button>
                                <span>Редактирование Профиля</span>
            
                                <span>Изображение Профиля</span>

                                <div style={{ userSelect: "none" }}>
                                    <img className={styles.mainPic} src={profileImgData.preview || `/images/testImage.jpg`} alt="Превью изображеня профиля"/>
                                </div>
                                <span>{profileImgData.fileName === "/images/testImage.jpg" ? "Файл не выбран" : profileImgData.fileName}</span>
                                <label className={styles.fileUploadLabel}>
                                    Выбрать изображение
                                    <input 
                                        type="file"
                                        name="profile_img"
                                        onChange={handleProfileFileChange}
                                        className={styles.hiddenFileInput}
                                        accept="image/*"
                                    />
                                </label>

                                <span>Имя пользователя</span>
                                <input 
                                        type="text" 
                                        name="username" 
                                        placeholder="Введите имя пользователя"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    
                                <span>Адрес доставки</span>
                                <input 
                                        type="text" 
                                        name="shipping_address" 
                                        placeholder="Введите адресс доставки"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        style={{"width": "350px"}}
                                    />
                                <span>Текущий пароль</span>
                                <input 
                                        type="password" 
                                        name="current_password" 
                                        placeholder="Введите текущий пароль"
                                        autoComplete="current-password"
                                    />
                                <div className={styles.pasEmailWrapper}>
                                    <div className={styles.pasEmailWrapperCol}>
                                        <span>Новый пароль</span>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            placeholder="Введите новый пароль"
                                            autoComplete="new-password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.pasEmailWrapperCol}>
                                        <span>Email</span>
                                        <input 
                                            type="text" 
                                            name="email" 
                                            placeholder="Введите Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <span style={{"fontSize": "16px", "marginTop": "5px"}}>
                                    Чтобы изменить пароль или Email нужно ввести текущий пароль
                                </span>
                            
                                <button 
                                    className={`${styles.createBrandAndProfileButton} ${!isProfileEditFormChanged ? styles.disabledButton : ""}`}
                                    type="submit"
                                    disabled={!isProfileEditFormChanged}
                                >
                                    Изменить профиль
                                </button>
                            </form>
                        )}
                        
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
                                        <img className={styles.mainPic} src={brandImgData.preview || `/images/testImage.jpg`} alt="Превью изображеня бренда"/>
                                    </div>
                                    <span>{brandImgData.fileName === "/images/testImage.jpg" ? "Файл не выбран" : brandImgData.fileName}</span>
                                    <label className={styles.fileUploadLabel}>
                                        Выбрать изображение
                                        <input 
                                            type="file"
                                            name="brand_img"
                                            onChange={handleBrandFileChange}
                                            className={styles.hiddenFileInput} 
                                            accept="image/*"
                                        />
                                    </label>

                                    <span>Название бренда</span>
                                    <input 
                                        type="text" 
                                        name="brand_name" 
                                        placeholder="Введите название бренда"
                                        onChange={() => setBrandErrors({ brandName: false })}
                                        className={brandErrors.brandName ? styles.errorBorder : ""}
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
                                    <button className={styles.createBrandAndProfileButton} type="submit">Создать бренд</button>
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
                                    <div className={styles.brandAndProfileActionsWrapper}>
                                        <button>Заказы клиентов</button>
                                        <button>Товары бренда</button>
                                        <Link to={"/constructor"} className={styles.linkBtn}>
                                            Создать товар
                                        </Link>
                                        <button onClick={() => setIsWillingToEditBrand(true)}>Редактировать бренд</button>
                                        <button onClick={() => setIsWillingToDeleteBrand(true)}>Удалить бренд</button>
                                    </div>
                                    
                                    {isWillingToDeleteBrand && 
                                        <div className={styles.deleteBrandAndProfileModal}>
                                            <div className={styles.deleteBrandAndProfileModalContent}>
                                                <span>Вы действительно хотите удалить свой бренд <b>{fullUserProfile.brand_name}</b>?</span>
                                                <span>После удаления все связанные с ним данные будут недоступны.</span>
                                                <div className={styles.deleteBrandAndProfileModalActionsWrapper}>
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
                                        <img className={styles.mainPic} src={brandImgData.preview || `/images/testImage.jpg`} alt="Превью изображеня бренда"/>
                                    </div>
                                    <span>{brandImgData.fileName === "/images/testImage.jpg" ? "Файл не выбран" : brandImgData.fileName}</span>
                                    <label className={styles.fileUploadLabel}>
                                        Выбрать изображение
                                        <input 
                                            type="file"
                                            name="brand_img"
                                            onChange={handleBrandFileChange}
                                            className={styles.hiddenFileInput} 
                                            accept="image/*"
                                        />
                                    </label>

                                    <span>Название бренда</span>
                                    <input 
                                        type="text" 
                                        name="brand_name" 
                                        placeholder="Введите название бренда"
                                        value={brandName}
                                        onChange={handleBrandNameChange}
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
                                        className={`${styles.createBrandAndProfileButton} ${!isBrandEditFormChanged ? styles.disabledButton : ""}`}
                                        type="submit"
                                        disabled={!isBrandEditFormChanged}
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
                    <ReturnBackBtn />
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