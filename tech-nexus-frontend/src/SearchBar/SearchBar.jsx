import styles from "./SearchBar.module.css";
import MagGlass from "../assets/magnifying-glass-svgrepo-com.svg";

// Guess that will be GET request to server with specified id. Route will be something like app.get("/:id_of_category").

export default function SearchBar(){
    return(
        <>
            <div className={styles.searchBarContainer}>
                <input type="text" placeholder="Название товара или категории..." className={styles.searchBarInputBox}/>
                <button className={styles.MagGlassButton}>
                    <img src={MagGlass} alt="MagGlass" />
                </button>
            </div>
        </>
    );
}