import styles from "./SmallCharacteristicsTable.module.css";
import { useState, useEffect, useRef } from "react";


export default function SmallCharacteristicsTable( {characteristics, values} ) {

    const [spanWidths, setSpanWidths] = useState([]);
    const spanRefs = useRef([]);

    useEffect(() => {
        setSpanWidths(spanRefs.current.map(span => span?.offsetWidth || 0));
    }, []);

    return (
        <>
            <div className={styles.characteristicsWrapper}>
                {characteristics.map((text, index) => (
                    <div className={styles.characteristicsRow} key={index}>
                        <div className={styles.characteristicsTableHeaderDiv}>
                            <div className={styles.characteristicsTableHeader}>
                                <span ref={el => (spanRefs.current[index] = el)}>{text}</span>
                            </div>
                            <div className={styles.underlineDelimeter} style={{ left: `${spanWidths[index] + 8}px` }}></div>
                        </div>
                        <div className={styles.characteristicsTableCharValue}>
                            <span>{values[index]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}