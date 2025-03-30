import styles from "./ImageGallery.module.css";
import arrowUp from "../assets/arrow-up.svg";
import arrowDown from "../assets/arrow-down.svg";
import { useState, useEffect, useRef } from "react";


export default function ImageGallery({ thumbnails }) {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const thumbnailsRef = useRef(null);
    const mainImgRef = useRef(null);

    // Amount of px for scroll
    const scrollAmount = 120;

    // Checks, if scroll up or down is available
    const checkScroll = () => {
        if(thumbnailsRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = thumbnailsRef.current;
            setCanScrollUp(scrollTop > 0);
            setCanScrollDown((scrollTop + clientHeight) < scrollHeight);
        }
    };

    // Check thumbnails on mount
    useEffect(() => {
            const timeout = setTimeout(() => {
               checkScroll(); 
            }, 50);
            
            return () => clearTimeout(timeout);
    }, []);

    // Functions for scroll
    const scrollUp = () => {
        if (thumbnailsRef.current) {
            thumbnailsRef.current.scrollBy({ top: -scrollAmount, behavior: "smooth"});
        }
    };

    const scrollDown = () => {
        if (thumbnailsRef.current) {
            thumbnailsRef.current.scrollBy({ top: scrollAmount, behavior: "smooth"});
        }
    };

    // Mouse over MainImg handlers for dinamic zoom
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        mainImgRef.current.style.transform = "scale(1)";
        mainImgRef.current.style.transformOrigin = "center";
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = mainImgRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        const xPercent = (x / width) * 100;
        const yPercent = (y / height) * 100;

        mainImgRef.current.style.transform = "scale(1.7)";
        mainImgRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    };

    console.log(thumbnails);

    return(
        <>
            <div className={styles.imgGallery}>
                <div className={styles.thumbnailsWrapper}>
                    <button 
                        className={`${styles.scrollBtn} ${!canScrollUp ? styles.disabled : ""}`} 
                        onClick={scrollUp}
                        disabled={!canScrollUp}
                    >
                        <img src={arrowUp} alt="Прокрутить вверх" />
                    </button>
                    <div className={styles.thumbnails} ref={thumbnailsRef} onScroll={checkScroll}>
                        {
                            thumbnails.map((src, index) => (
                                <img 
                                    key={index}
                                    src={src}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`${styles.thumbnail} ${selectedIndex === index ? styles.selected : ""}`}
                                    onMouseOver={() => setSelectedIndex(index)}
                                />
                            ))
                        }
                    </div>
                    <button
                        className={`${styles.scrollBtn} ${!canScrollDown ? styles.disabled : ""}`}
                        onClick={scrollDown}
                        disabled={!canScrollDown}
                    >
                        <img src={arrowDown} alt="Прокрутить вниз" />
                    </button>
                </div>
                <div className={styles.mainImageContainer}>
                    <img 
                        ref={mainImgRef}
                        className={styles.mainImg}
                        src={thumbnails[selectedIndex]}
                        alt="Главное изображение товара"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                    />    
                </div>
            </div>
        </>
    );
}