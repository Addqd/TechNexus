import SearchBar from "../SearchBar/SearchBar.jsx";
import userCirlcle from "../assets/user-circle-svgrepo-com.svg";
import styles from "./Header.module.css";
import SideBarMenu from "../SideBarMenu/SideBarMenu.jsx";
import Notification from "../Notification/Notification.jsx";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header(){

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [showFailNotification, setShowFailNotification] = useState(false);
    const [failMsg, setFailMsg] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
    const [isMiniAccountModalOpen, setIsMiniAccountModalOpen] = useState(false);
    const [isUserLogedIn, setIsUserLogedIn] = useState(false);
    const [miniUser, setMiniUser] = useState({ name: "", img: userCirlcle });
    const enterButtonRef = useRef(null);
    const miniAccountModalRef = useRef(null);
    const enterModalRef = useRef(null);

    const location = useLocation();
    const navigate = useNavigate();

    const openSignInModal = () => {
        setIsEnterModalOpen(false);
        setIsSignInModalOpen(true);
    };

    const closeSignInModal = () => {
        setIsSignInModalOpen(false);
    };

    const openEnterModal = () => {
        setIsEnterModalOpen(true);
    };
    
    const closeEnterModal = () => {
        setIsEnterModalOpen(false);
    };

    const openLoginModal = () => {
        setIsEnterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const openMiniAccountModal = () => {
        setIsMiniAccountModalOpen(true);
    };

    const closeMiniAccountModal = () => {
        setIsMiniAccountModalOpen(false);
    };

    useEffect(() => {
        const userLoggedIn = Cookies.get("isUserLoggedIn");
        if(userLoggedIn === "true") {
            setIsUserLogedIn(true);
            const userId = Cookies.get("userId");
            if (userId) {
                fetchMiniUserData(userId);
            }
        }

        function getCookies() {
            const cookies = document.cookie.split('; ');
            const cookieObject = {};
            
            cookies.forEach(cookie => {
                const [key, value] = cookie.split('=');
                cookieObject[key] = decodeURIComponent(value);
            });
            
            return cookieObject;
        }
        
        const allCookies = getCookies();
        console.log(allCookies);
        
    }, []);

    /* Handle closure of every modal when redirected to other page */

    useEffect(() => {
        setIsLoginModalOpen(false);
        setIsSignInModalOpen(false);
        setIsEnterModalOpen(false);
        setIsMiniAccountModalOpen(false);
    }, [location.pathname]);

    /* Handle click outside of modals to close them */

    useEffect(() => {
        function handleClickOutside(event) {
            
            if (event.target === enterButtonRef.current || enterButtonRef.current.contains(event.target)) {
                return;
            }

            /* const isEnterButton = enterButtonRef.current.contains(event.target); */

            if (/* !isEnterButton && */
            (miniAccountModalRef.current && !miniAccountModalRef.current.contains(event.target)) ||
            (enterModalRef.current && !enterModalRef.current.contains(event.target))) {
                setIsMiniAccountModalOpen(false);
                setIsEnterModalOpen(false);
            }
        }

        if (isMiniAccountModalOpen || isEnterModalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMiniAccountModalOpen, isEnterModalOpen]);

    // Register user on submit
    const handleRegisterFormSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            username: e.target.username.value,
            password: e.target.password.value,
            email: e.target.email.value
        };

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });

            if(response.ok){
                const data = await response.json();
                setShowSuccessNotification(true);
                setSuccessMsg(data.message);
                setIsUserLogedIn(true);
                Cookies.set("isUserLoggedIn", "true", { expires: 7 });
                Cookies.set("userId", data.newUser.id, { expires: 7 });
            }
            else{
                const errorData = await response.json();
                setShowFailNotification(true);
                setFailMsg(errorData.error || errorData.message);
            }

            console.log(`isUserLogedIn: ${isUserLogedIn}`);
        } 
        catch (error) {
            console.error("Registration failed", error);
        }
    };

    // Login user on submit
    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            login: e.target.login.value,
            password: e.target.password.value
        };

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            if(response.ok){
                const data = await response.json();
                setShowSuccessNotification(true);
                setSuccessMsg(data.message);
                setIsUserLogedIn(true);
                Cookies.set("isUserLoggedIn", "true", { expires: 7 });
                Cookies.set("userId", data.user.id, { expires: 7 });
            }
            else{
                const errorData = await response.json();
                setShowFailNotification(true);
                setFailMsg(errorData.error || errorData.message);
            }
        }
        catch (error) {
            console.error("Login failed", error);
        }
    };

    const fetchMiniUserData = async (userId) => {
        try{
            const response = await fetch(`http://localhost:8000/mini_profile/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setMiniUser({ name: data.username, img: data.profile_img || userCirlcle });
            }
        }
        catch (error) {
            console.error("Ошибка при загрузке малого профиля пользователя", error);
        }
    };

    // Logout function

    const logOut = () => {
        setIsUserLogedIn(false);
        Cookies.remove("isUserLoggedIn");
        setMiniUser({ name: "", img: userCirlcle});
        Cookies.remove("userId");
        window.location.reload();
    };

    useEffect(() => {
        console.log(`isUserLogedIn: ${isUserLogedIn}`);
    }, [isUserLogedIn]);

    useEffect(() => {
        const isUserLoggedInCookie = Cookies.get("isUserLoggedIn");
        const userIdCookie = Cookies.get("userId");

        if (!isUserLoggedInCookie || !userIdCookie) {
            if (isUserLogedIn) {
                logOut();
            }
        }
    });

    return(
        <>
        <header className={styles.headerContainer}>
               <SideBarMenu />
               <img 
                    src="/images/TechNexusTransparrentLogo.png" 
                    alt="Лого сайта"
                    className={styles.logoPic} 
                    onClick={() => navigate("/")}
                />
               <SearchBar />

               <div>
                    {!isUserLogedIn &&
                        <div className={styles.enterWrapper}>
                            <button className={styles.enterButton} onClick={isEnterModalOpen ? closeEnterModal : openEnterModal} ref={enterButtonRef}>
                                <img src={userCirlcle} alt="Войти" />
                                <span>Вход</span>
                            </button> 
                            <div>
                                {isEnterModalOpen &&
                                    <div className={styles.modalWindowEnter} ref={enterModalRef}>
                                        <div className={styles.modalWindowEnterContent}>
                                            <button onClick={openLoginModal}>Войти</button>
                                            <button onClick={openSignInModal}>Регистрация</button>
                                            <button onClick={logOut}>Выйти</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>     
                    }
               </div>
               
                {/* Shows user img and name with coresponding actions in modal IF loged in */}

                {/* Redirect to homepage if loged out */}
               <div>
                    {isUserLogedIn &&
                        <div className={styles.enterWrapper}>
                            <button className={styles.enterButton} onClick={isMiniAccountModalOpen ? closeMiniAccountModal : openMiniAccountModal} ref={enterButtonRef}>
                                <img src={miniUser.img} alt="Картинка профиля" />
                                <span>{miniUser.name}</span>
                            </button>
                            <div>
                                {isMiniAccountModalOpen &&
                                    <div className={styles.modalWindowEnter} ref={miniAccountModalRef}>
                                        <div className={styles.modalWindowEnterContent}>
                                            <Link to={`/profile/${Cookies.get("userId")}`} className={styles.linkBtn}>
                                                Профиль
                                            </Link>
                                            <button>Заказы</button>
                                            <button>Баланс</button>
                                            <button>История</button>
                                            <button onClick={logOut}>Выйти</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
               </div>

                {/* Sign up modal */}

                <div>
                    {isSignInModalOpen &&
                        <div className={styles.modalWindowLoginAndSignIn}>
                            <form className={styles.modalWindowLoginAndSignInContent} onSubmit={handleRegisterFormSubmit} >
                                <span>Имя пользователя</span>
                                <input type="text" name="username" placeholder="Введите ваш псевдоним"/>
                                <span>Пароль</span>
                                <input type="text" name="password" placeholder="Введите ваш пароль"/>
                                <span>Email</span>
                                <input type="text" name="email" placeholder="Введите ваш Email"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeSignInModal}>Отмена</button>
                                    <button type="submit">Зарегистрироваться</button>  
                                </div>
                                <span 
                                    onClick={() => {
                                        closeSignInModal();
                                        openLoginModal(); }}
                                    className={styles.hoverableText}
                                    >Уже есть аккаунт? Войдите здесь</span>
                            </form>
                            {showSuccessNotification &&
                                <Notification 
                                    message={successMsg}
                                    onClose={() => {
                                        setShowSuccessNotification(false);
                                        closeSignInModal();
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
                                        setErrorMsg("");
                                    }} 
                                />
                            }
                            
                        </div>    
                    }
                </div>
                
                {/* Login modal */}

                <div>
                    {isLoginModalOpen && 
                        <div className={styles.modalWindowLoginAndSignIn}>
                            <form className={styles.modalWindowLoginAndSignInContent} onSubmit={handleLoginFormSubmit}>
                                <span>Имя пользователя или Email</span>
                                <input type="text" name="login" placeholder="Введите ваш логин"/>
                                <span>Пароль</span>
                                <input type="text" name="password" placeholder="Введите ваш пароль"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeLoginModal}>Отмена</button>
                                    <button type="submit">Войти</button>  
                                </div>
                                <span onClick={() => {
                                    closeLoginModal();
                                    openSignInModal();
                                }}
                                className={styles.hoverableText}
                                >Нет аккаунта? Зарегистрируйтесь здесь</span>
                            </form>

                            {showSuccessNotification &&
                                <Notification 
                                    message={successMsg}
                                    onClose={() => {
                                        setShowSuccessNotification(false);
                                        closeLoginModal();
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
                                        setErrorMsg("");
                                    }} 
                                />
                            }
                        </div>    
                    }
                </div>
            
        </header>
        </>
    );
}