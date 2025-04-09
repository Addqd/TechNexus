import styles from "./ReturnBackBtn.module.css";
import { useNavigate } from "react-router-dom";

export default function ReturnBackBtn() {

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <>
            <button className={styles.returnBackBtn} onClick={handleGoBack} type="button">
                Назад
            </button>
        </>
    );
}