import styles from "./ProductConstructor.module.css";
import ReturnBackBtn from "../ReturnBackBtn/ReturnBackBtn";
import { useState } from "react";
import Select from "react-select";

export default function ProductConstructor() {

    const [description, setDescription] = useState("");

    // maxLength for text area
    const maxLength = 600;

    const selectOptions = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' },
        { value: 'mint', label: 'Mint' },
        { value: 'coffee', label: 'Coffee' },
        { value: 'cookie_dough', label: 'Cookie Dough' },
        { value: 'pistachio', label: 'Pistachio' },
        { value: 'mango', label: 'Mango' },
        { value: 'raspberry', label: 'Raspberry' },
        { value: 'blueberry', label: 'Blueberry' },
        { value: 'lemon', label: 'Lemon' },          
        { value: 'lime', label: 'Lime' },           
        { value: 'watermelon', label: 'Watermelon' }, 
        { value: 'peach', label: 'Peach' },         
        { value: 'pear', label: 'Pear' },            
        { value: 'apple', label: 'Apple' },          
        { value: 'apricot', label: 'Apricot' },      
        { value: 'blackberry', label: 'Blackberry' },
        { value: 'cherry', label: 'Cherry' },        
        { value: 'coconut', label: 'Coconut' },     
        { value: 'fig', label: 'Fig' },             
        { value: 'grapefruit', label: 'Grapefruit' }, 
        { value: 'grape', label: 'Grape' },          
        { value: 'kiwi', label: 'Kiwi' },            
        { value: 'nectarine', label: 'Nectarine' },  
        { value: 'orange', label: 'Orange' },        
        { value: 'papaya', label: 'Papaya' },        
        { value: 'plum', label: 'Plum' },            
        { value: 'pomegranate', label: 'Pomegranate' },
        { value: 'applesauce', label: 'Applesauce' }
    ];

    const userSelectNone = {
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
    };
      
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            width: '250px',
            fontSize: '16px',
            ...userSelectNone,
            boxShadow: 'none',              
            outline: 'none',
            border: 'none'
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'hsl(0, 0%, 80%)'    
                : state.isFocused
                ? 'hsl(0, 0%, 70%)'       
                : 'hsl(0, 0%, 100%)',     
            color: state.isSelected
                ? 'hsl(0, 0%, 0%)'       
                : 'hsl(0, 0%, 20%)',      
            fontSize: '14px',
            cursor: 'pointer',
            userSelect: state.isFocused ? 'text' : 'none',
            WebkitUserSelect: state.isFocused ? 'text' : 'none',
            MozUserSelect: state.isFocused ? 'text' : 'none',
            msUserSelect: state.isFocused ? 'text' : 'none',
            transition: 'background-color 0.3s ease'
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'hsl(0, 0%, 0%)',       
            fontSize: '16px',
            ...userSelectNone,
        }),
        placeholder: (provided) => ({
            ...provided,
            ...userSelectNone,
            color: 'hsl(0, 0%, 40%)',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            ...userSelectNone,
        }),
        menu: (provided) => ({
            ...provided,
            ...userSelectNone,
        }),
        valueContainer: (provided) => ({
            ...provided,
            ...userSelectNone,
        }),
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div className={styles.constructorFormWrapper}>
            <form className={styles.constructorForm}>
                <ReturnBackBtn />
                <span>Категория товара</span>
                <span>Название товара</span>
                <input
                    type="text" 
                    name="product_name"
                    placeholder="Введите название товара..."
                />
                <span>Фотографии</span>
                <div className={styles.imagesFetcher}>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                    <div className={styles.imagesFetcherImgTest}>

                    </div>
                </div>
                <span>Производитель</span>
                <Select
                    options={selectOptions}
                    styles={customStyles} 
                    placeholder="Выберите производителя..."
                    name="producer"
                />
                <span>Описание товара</span>
                <div className={styles.textareaContainer}>
                    <textarea 
                        name="product_description"
                        placeholder="Введите описание товара"
                        rows='5'
                        cols='50'
                        maxLength={maxLength}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <span className={styles.charCount}>
                        {description.length}/{maxLength}
                    </span>    
                </div>
                <div>Characteristics Fetcher</div>
                <span>Цена</span>
                <input type="text" name="price" placeholder="Введите цену..."/>
                <button type="submit" className={styles.createProductButton}>Создать товар</button>
            </form>
        </div>
    );
}