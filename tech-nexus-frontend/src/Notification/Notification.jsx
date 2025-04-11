import styles from "./Notification.module.css";
import { useState } from "react";

export default function Notification({ message, onClose }) {

    const [isNotificationOpen, setIsNotificationOpen] = useState(true);

    const handleClose = () => {
        setIsNotificationOpen(false);
        if (onClose) onClose();
    };

    return (
        <>  
            {isNotificationOpen &&
               <div className={styles.notificationModalWrapper}>
                    <div className={styles.notificationModalContent}>
                        <span>{message}</span>
                        <button onClick={handleClose}>Закрыть</button>
                    </div>
                </div> 
            }
        </>
    );
}