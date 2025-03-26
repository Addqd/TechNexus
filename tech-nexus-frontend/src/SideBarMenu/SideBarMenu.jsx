import styles from "./SideBarMenu.module.css";
import { useState } from "react";
import sideBarButton from "../assets/menu-symbol-of-three-parallel-lines-svgrepo-com.svg";

// Add something bautiful here

export default function SideBarMenu(){

    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return(
        <>
            <button className={styles.sideBarButton} onClick={toggleSidebar}>
                <img src={sideBarButton} alt="sideBarButton"/>
            </button>

            <div className={`${styles.sideBar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <p><a href="">Наушники</a></p>
                <p><a href="">Видеокарты</a></p>
                <p><a href="">Компьютерные мыши</a></p>
                <p><a href="">Охлаждение</a></p>
                <p><a href="">Клавиатуры</a></p>
            </div>
        </>
    );

}