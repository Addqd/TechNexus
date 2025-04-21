import styles from "./SideBarMenu.module.css";
import { useEffect, useState } from "react";
import sideBarButton from "../assets/menu-symbol-of-three-parallel-lines-svgrepo-com.svg";
import { Link } from "react-router-dom";

// Add something bautiful here

export default function SideBarMenu(){

    const [isOpen, setIsOpen] = useState(false);

    const reloadAfterNav = () => {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        setIsOpen(false);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return(
        <>
            <button className={styles.sideBarButton} onClick={toggleSidebar}>
                <img src={sideBarButton} alt="sideBarButton"/>
            </button>

            <div className={`${styles.sideBar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <span className={styles.masterCategoryName}>Внутренняя периферия</span>
                    <Link 
                        to={`/category/${encodeURIComponent("Кулеры")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Кулеры
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Блоки питания")}`}
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Блоки питания
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Видеокарты")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Видеокарты
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Материнские платы")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Материнские платы
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Оперативная память")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Оперативная память
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Центральные процессоры")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Центральные процессоры
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Провода")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Провода
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Накопители")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Накопители
                    </Link>
                    <Link 
                        to={`/category/${encodeURIComponent("Подсветка")}`} 
                        onClick={reloadAfterNav}
                        className={styles.categoryName}
                    >
                        Подсветка
                    </Link>
                <span className={styles.masterCategoryName}>Внешняя периферия</span>
                    <Link 
                            to={`/category/${encodeURIComponent("Колонки")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Колонки
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Мониторы и телевизоры")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Мониторы и телевизоры
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("VR-гарнитуры")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        VR-гарнитуры
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Клавиатуры")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Клавиатуры
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Компьютерные мыши")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Компьютерные мыши
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Наушники")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Наушники
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Геймпады")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Геймпады
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Внешние накопители")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Внешние накопители
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Микрофоны")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Микрофоны
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Принтеры")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Принтеры
                    </Link>
                <span className={styles.masterCategoryName}>Бытовая техника</span>
                    <Link 
                            to={`/category/${encodeURIComponent("Холодильники")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Холодильники
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Микроволновки")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Микроволновки
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Кухонные плиты")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Кухонные плиты
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Стиральные машины")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Стиральные машины
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Обогреватели")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Обогреватели
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Пылесосы")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Пылесосы
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Сплит-системы")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Сплит-системы
                    </Link>
                <span className={styles.masterCategoryName}>Разное</span>
                    <Link 
                            to={`/category/${encodeURIComponent("Приборы ухода")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Приборы ухода
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Аксессуары для устройств")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Аксессуары для устройств
                    </Link>
                    <Link 
                            to={`/category/${encodeURIComponent("Расходные материалы")}`} 
                            onClick={reloadAfterNav}
                            className={styles.categoryName}
                        >
                        Расходные материалы
                    </Link>
            </div>
        </>
    );

}