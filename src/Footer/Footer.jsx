import styles from "./Footer.module.css";

export default function Footer(){

    return(
        <>
            <footer className={styles.footerContainer}>
                    <div className={styles.userIfno}>
                        <p><b>Покупателям и продавцам</b></p>
                        <p><a href="">Как пользоваться сайтом</a></p>
                        <p><a href="">Вопросы и ответы</a></p>
                    </div>
                    <div className={styles.copyrightSection}>
                       <p>© TechNexus 2024. Все права защищены.</p> 
                    </div>
                    <div className={styles.About}>
                        <p><b>Про нас</b></p>
                        <p>
                            <a href="https://github.com/Addqd/TechNexus">
                                <img src="/images/QR_GitHub.jpg" alt="QrCode" />
                            </a>
                        </p><br />
                    </div>
            </footer>
        </>
    );
}