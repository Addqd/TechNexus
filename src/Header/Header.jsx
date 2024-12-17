import SearchBar from "../SearchBar/SearchBar.jsx";
import userCirlcle from "../assets/user-circle-svgrepo-com.svg";
import styles from "./Header.module.css";
import SideBarMenu from "../SideBarMenu/SideBarMenu.jsx";

export default function Header(){

    return(
        <>
        <header className={styles.headerContainer}>
               <SideBarMenu />
               <SearchBar />
               <button className={styles.LogInButton}>
                    <img src={userCirlcle} alt="userCirlce" /><br />Войти
               </button>
        </header>
        </>
    );
}