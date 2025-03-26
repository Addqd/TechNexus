import SearchBar from "../SearchBar/SearchBar.jsx";
import userCirlcle from "../assets/user-circle-svgrepo-com.svg";
import signIn from "../assets/sign-in.svg";
import styles from "./Header.module.css";
import SideBarMenu from "../SideBarMenu/SideBarMenu.jsx";
import { useState, useEffect } from "react";

// Impement user login and registration, wether as a simple buyer, or as a seller (give abbility to register their brand)

export default function Header(){

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isEnterModalOpen, setIsEnterModalOpen] = useState(false);

    const openSignInModal = () => {
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
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    /* 
        1. Implement The hole login and sign in thing <--
        2. Change usercircle and it's corresponding modal when logged in
    */

    return(
        <>
        <header className={styles.headerContainer}>
               <SideBarMenu />
               <SearchBar />
               <div className={styles.enterWrapper}>
                    <button className={styles.enterButton} onClick={isEnterModalOpen ? closeEnterModal : openEnterModal}>
                        <img src={userCirlcle} alt="Войти" /><br />Вход
                    </button> 
                    <div>
                        {isEnterModalOpen &&
                            <div className={styles.modalWindowEnter}>
                                <div className={styles.modalWindowEnterContent}>
                                    <button onClick={openLoginModal}>Войти</button>
                                    <button onClick={openSignInModal}>Регистрация</button>
                                </div>
                            </div>
                        }
                    </div>
               </div>

                {/* Sign in modal */}

                <div>
                    {isSignInModalOpen &&
                        <div className={styles.modalWindowLoginAndSignIn}>
                            <form className={styles.modalWindowLoginAndSignInContent}>
                                <label>Псевдоним</label>
                                <input type="text" placeholder="Введите ваш псевдоним"/>
                                <label>Пароль</label>
                                <input type="text" placeholder="Введите ваш пароль"/>
                                <label>Повторите пароль</label>
                                <input type="text" placeholder="Повторите ваш пароль"/>
                                <label>Email</label>
                                <input type="text" placeholder="Введите ваш Email"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeSignInModal}>Отмена</button>
                                    <button>Войти</button>  
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
                            <form className={styles.modalWindowLoginAndSignInContent}>
                                <label >Логин</label>
                                <input type="text" placeholder="Введите ваш логин"/>
                                <label>Пароль</label>
                                <input type="text" placeholder="Ввелите ваш пароль"/>
                                <div className={styles.modalEnterCancelLogin}>
                                    <button onClick={closeLoginModal}>Отмена</button>
                                    <button>Войти</button>  
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