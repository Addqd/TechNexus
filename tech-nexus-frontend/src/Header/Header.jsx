import SearchBar from "../SearchBar/SearchBar.jsx";
import userCirlcle from "../assets/user-circle-svgrepo-com.svg";
import styles from "./Header.module.css";
import SideBarMenu from "../SideBarMenu/SideBarMenu.jsx";
import Cookies from "js-cookie";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header(){

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);
    const [isMiniAccountModalOpen, setIsMiniAccountModalOpen] = useState(false);
    const [isUserLogedIn, setIsUserLogedIn] = useState(false);
    const [miniUser, setMiniUser] = useState({ name: "", img: userCirlcle });
    const miniAccountModalRef = useRef(null);
    const enterModalRef = useRef(null);

    const location = useLocation();

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

            const isEnterButton = event.target.closest(`.${styles.enterButton}`);

            if (!isEnterButton &&
            miniAccountModalRef.current && !miniAccountModalRef.current.contains(event.target) ||
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
                window.alert(data.message);
                setIsUserLogedIn(true);
                Cookies.set("isUserLoggedIn", "true", { expires: 7 });
                Cookies.set("userId", data.newUser.id, { expires: 7 });
                closeSignInModal();
                window.location.reload();
            }
            else{
                const errorData = await response.json();
                window.alert(errorData.error);
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
                window.alert(data.message);
                setIsUserLogedIn(true);
                Cookies.set("isUserLoggedIn", "true", { expires: 7 });
                Cookies.set("userId", data.user.id, { expires: 7 });
                closeLoginModal();
                window.location.reload();
            }
            else{
                const errorData = await response.json();
                window.alert(errorData.error);
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
            console.error("Ошибка при загрузке милого профиля пользователя", error);
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

    /* 
        1. Implement The hole login and sign in thing (DONE)
        2. Add validation of user data on server (password.correct?, login.correct?)
        on regestration and login (DONE)
        3. Change usercircle and it's corresponding modal when logged in <-- (Add more btns, modify registration, add state change of userloggedin in there as well, and page refresh)
        4. Add validation of user data in frontend as well (PENDING)
        5. Think about adding jwt token authorization (PENDING)
    */

    useEffect(() => {
        console.log(`isUserLogedIn: ${isUserLogedIn}`);
    }, [isUserLogedIn]);

    return(
        <>
        <header className={styles.headerContainer}>
               <SideBarMenu />
               <SearchBar />

                {/* Shows default svg and btns IF NOT loged in */}

               <div>
                    {!isUserLogedIn &&
                        <div className={styles.enterWrapper}>
                            <button className={styles.enterButton} onClick={isEnterModalOpen ? closeEnterModal : openEnterModal}>
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
                            <button className={styles.enterButton} onClick={isMiniAccountModalOpen ? closeMiniAccountModal : openMiniAccountModal}>
                                <img src={miniUser.img} alt="Картинка профиля" />
                                <span>{miniUser.name}</span>
                            </button>
                            <div>
                                {isMiniAccountModalOpen &&
                                    <div className={styles.modalWindowEnter} ref={miniAccountModalRef}>
                                        <div className={styles.modalWindowEnterContent}>
                                            <button>
                                                <Link to={"/profile"}>
                                                    Профиль
                                                </Link>
                                            </button>
                                            <button>Заказы</button>
                                            <button>Баланс</button>
                                            <button>Избранное</button>
                                            <button>Купленные товары</button>
                                            <button onClick={logOut}>Выйти</button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
               </div>

                {/* Sign in modal */}

                <div>
                    {isSignInModalOpen &&
                        <div className={styles.modalWindowLoginAndSignIn}>
                            <form className={styles.modalWindowLoginAndSignInContent} onSubmit={handleRegisterFormSubmit}>
                                <label>Псевдоним</label>
                                <input type="text" name="username" placeholder="Введите ваш псевдоним"/>
                                <label>Пароль</label>
                                <input type="text" name="password" placeholder="Введите ваш пароль"/>
                                <label>Повторите пароль</label>
                                <input type="text" placeholder="Повторите ваш пароль"/>
                                <label>Email</label>
                                <input type="text" name="email" placeholder="Введите ваш Email"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeSignInModal}>Отмена</button>
                                    <button type="submit">Зарегистрироваться</button>  
                                </div>
                                <span onClick={() => {
                                   closeSignInModal();
                                   openLoginModal(); 
                                }}>Уже есть аккаунт? Войдите здесь</span>
                            </form>
                        </div>    
                    }
                </div>
                
                {/* Login modal */}

                <div>
                    {isLoginModalOpen && 
                        <div className={styles.modalWindowLoginAndSignIn}>
                            <form className={styles.modalWindowLoginAndSignInContent} onSubmit={handleLoginFormSubmit}>
                                <label >Имя пользователя или Email</label>
                                <input type="text" name="login" placeholder="Введите ваш логин"/>
                                <label>Пароль</label>
                                <input type="text" name="password" placeholder="Ввелите ваш пароль"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeLoginModal}>Отмена</button>
                                    <button type="submit">Войти</button>  
                                </div>
                                <span>Забыли пароль?</span>
                                <span onClick={() => {
                                    closeLoginModal();
                                    openSignInModal();
                                }}>Нет аккаунта? Зарегистрируйтесь здесь</span>
                            </form>
                        </div>    
                    }
                </div>
            
        </header>
        </>
    );
}