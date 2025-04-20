import styles from "./SearchBar.module.css";
import MagGlass from "../assets/magnifying-glass-svgrepo-com.svg";

export default function SearchBar(){
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type="text" placeholder="Название категории..." className={styles.searchBarInputBox}/>
                <button className={styles.MagGlassButton}>
                    <img 
                        src={MagGlass} 
                        alt="MagGlass"
                        /* onClick={}  */
                    />
                </button>
            </div>
        </>
    );
}