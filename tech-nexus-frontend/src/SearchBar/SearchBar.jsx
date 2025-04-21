import styles from "./SearchBar.module.css";
import MagGlass from "../assets/magnifying-glass-svgrepo-com.svg";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar(){

    const searchQuerryRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        const searchQueryText = searchQuerryRef.current.value.trim();

        if (!searchQueryText) return;

        console.log(searchQueryText);

        try {
            const response = await fetch(`http://localhost:8000/category?category_name=${searchQueryText}`);

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate(`/category/${encodeURIComponent(searchQueryText)}`);
                window.location.reload();
            }
            else {
                const errorData = await response.json();
                console.error(errorData.error || errorData.message);
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    return(
        <>
            <div className={styles.searchBarContainer}>
                <input 
                    type="text" 
                    placeholder="Название категории..." 
                    className={styles.searchBarInputBox}
                    name="search_querry"
                    ref={searchQuerryRef}
                />
                <button className={styles.MagGlassButton} onClick={handleSearch}>
                    <img 
                        src={MagGlass} 
                        alt="MagGlass"
                    />
                </button>
            </div>
        </>
    );
}