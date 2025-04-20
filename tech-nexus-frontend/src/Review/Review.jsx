import styles from "./Review.module.css";

export default function Review( {rating, reviewText} ) {
    return (
        <div className={styles.reviewWrapper}>
            <span>{rating}</span>
            <span>{reviewText}</span>
        </div>
    );
}