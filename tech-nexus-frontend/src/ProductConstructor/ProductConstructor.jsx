import styles from "./ProductConstructor.module.css";
import ReturnBackBtn from "../ReturnBackBtn/ReturnBackBtn";
import Notification from "../Notification/Notification";
import { useEffect, useState } from "react";
import crossInCircle from "../assets/cross-in-circle.svg";
import Select from "react-select";

export default function ProductConstructor() {

    const [showLimitNotification, setShowLimitNotification] = useState(false);
    const [showInvalidTypeNotification, setShowInvalidTypeNotification] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [thumnbnails, setThumbnails] = useState([]);
    const [description, setDescription] = useState("");

    const [previewImgData,  setPreviewImgData] = useState({
        fileName: "/images/testImage.jpg",
        preview: null
    });
    
    // Allowed img types: [jpg, png, webp, gif] 
    const allowedTypes = [
        "image/jpeg", 
        "image/png", 
        "image/webp", 
        "image/gif"
    ];

    // (Max amount of images for product) - (1 (preview))
    // 15 in total
    const maxImages = 14;

    // maxLength for text area
    const maxLength = 600;

    // Clear thumbnail previews on unmount
    useEffect(() => {
        return () => {
            thumnbnails.forEach((img) => {
                if (img.preview) {
                    URL.revokeObjectURL(img.preview);
                }
            })

            if (previewImgData.preview) {
                URL.revokeObjectURL(previewImgData.preview);
            }
        }
    }, []);

    useEffect(() => {
        console.log(previewImgData);
    }, [previewImgData]);

    useEffect(() => {
        console.log(thumnbnails);
    }, [thumnbnails]);

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
            ...userSelectNone
        }),
        valueContainer: (provided) => ({
            ...provided,
            ...userSelectNone,
        }),
    };

    // Add preview handler
    const handleAddPreview = (e) => {
        const file = e.target.files[0];

        // Bug fix of being unable to upload the same image twice
        e.target.value = "";

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            setShowInvalidTypeNotification(true);
            return;
        }

        if (file) {
            const objectURL = URL.createObjectURL(file);
            setPreviewImgData({
                fileName: file.name,
                preview: objectURL
            });
        }
    };

    // Add thumbnail handler
    const handleAddThumbnail = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Bug fix of being unable to upload the same image twice
        e.target.value = "";

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            setShowInvalidTypeNotification(true);
            return;
        }

        setThumbnails((prev) => {
            if (prev.length === maxImages) {
                setShowLimitNotification(true);
                return prev;
            }

            const preview = URL.createObjectURL(file);
            const newImage = {
                fileName: file.name,
                preview: preview
            };

            return [...prev, newImage];
        });
    }

    // Handle remove thumbnail
    const handleRemoveThumbnail = (indexToRemove) => {
        setThumbnails((prev) => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            
            const removed = prev[indexToRemove];
            
            if (removed?.preview) {
                URL.revokeObjectURL(removed.preview);
            }

            return updated;            
        });
    }

    // Category change handler
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        console.log(`Selected category: ${selectedOption.label} (${selectedOption.value})`);
        console.log("Selected category object:", selectedOption);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div className={styles.constructorFormWrapper}>
            <form className={styles.constructorForm}>
                <ReturnBackBtn />
                <span>Создание товара</span>
                <span>Название</span>
                <input
                    type="text" 
                    name="product_name"
                    placeholder="Введите название товара..."
                    className={styles.inputField}
                />
                <span>Главное изображение</span>
                <div style={{ userSelect: "none" }}>
                    <img 
                        className={styles.previewPic} 
                        src={previewImgData.preview || `/images/testImage.jpg`} 
                        alt="Превью товара"
                    />
                </div>
                <label className={styles.addImageButton}>
                    Добавить изображение
                    <input 
                        type="file"
                        name="main_pic"
                        onChange={handleAddPreview}
                        className={styles.hiddenFileInput}
                        accept="image/jpeg,image/png,image/webp,image/gif"
                    />
                </label>

                <span>Фотографии</span>
                <div className={`${styles.imagesFetcher} ${styles.scrollbarStyle}`}>
                    {thumnbnails.map((thumnbnail, index) => (
                        <div className={styles.imageWrapper} key={index}>
                            <img
                                src={thumnbnail.preview} 
                                alt={thumnbnail.fileName}
                                className={styles.imagesFetcherImg} 
                            />
                            <img 
                                src={crossInCircle} 
                                alt="Удалить"
                                className={styles.removeIcon}
                                onClick={() => handleRemoveThumbnail(index)} 
                            />
                        </div>
                    ))}
                </div>
                <div style={{"position": "relative"}}>
                    <label className={styles.addImageButton}>
                        Добавить изображение
                        <input 
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={handleAddThumbnail}
                            className={styles.hiddenFileInput}
                        />
                    </label>
                    <div className={styles.imgCount}>
                        {thumnbnails.length} / {maxImages}
                    </div>
                </div>
                
                {showLimitNotification && 
                    <Notification 
                        message={"Можно прикрепить всего 14 фотографий"}
                        onClose={() => setShowLimitNotification(false)}
                    />
                }
                {showInvalidTypeNotification &&
                    <Notification 
                        message={"Неподдерживаемый формат файла. Разрешены только: jpg, png, webp, gif"}
                        onClose={() => setShowInvalidTypeNotification(false)}
                    />
                }
                <span>Производитель</span>
                <Select
                    options={selectOptions}
                    styles={customStyles} 
                    placeholder="Выберите производителя..."
                    name="producer"
                />
                <span>Описание</span>
                <div className={`${styles.textareaContainer} ${styles.scrollbarStyle}`}>
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
                <span>Категория</span>
                <Select 
                    options={selectOptions} 
                    styles={customStyles} 
                    placeholder="Выберите категорию..."
                    name="category_name"
                    onChange={handleCategoryChange}
                />
                <span>Характеристики</span>
                <div className={`${styles.characteristicsContainer} ${styles.scrollbarStyle}`}>
                    {selectedCategory && 
                        <>
                        <div className={styles.characteristicsWrapper}>
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите характеристику..."
                                name="attribute"
                            />
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите значение..."
                                name="attribute_value"
                            />
                        </div>
                        <div className={styles.characteristicsWrapper}>
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите характеристику..."
                                name="attribute"
                            />
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите значение..."
                                name="attribute_value"
                            />
                        </div>
                        <div className={styles.characteristicsWrapper}>
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите характеристику..."
                                name="attribute"
                            />
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите значение..."
                                name="attribute_value"
                            />
                        </div>
                        <div className={styles.characteristicsWrapper}>
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите характеристику..."
                                name="attribute"
                            />
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите значение..."
                                name="attribute_value"
                            />
                        </div>
                        <div className={styles.characteristicsWrapper}>
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите характеристику..."
                                name="attribute"
                            />
                            <Select
                                options={selectOptions}
                                styles={customStyles} 
                                placeholder="Выберите значение..."
                                name="attribute_value"
                            />
                        </div>      
                        </>
                        
                    }
                          
                </div>
                <span style={{"fontSize": "16px"/* , "marginTop": "5px" */}}>
                    Чтобы назначить характеристики, необходимо выбрать категорию
                </span>
                <span>Цена</span>
                <div className={styles.currency}>
                    <input 
                        type="text" 
                        name="price" 
                        placeholder="Введите цену..." 
                        className={styles.inputField}
                    />
                    <span>₽</span>
                </div>
                
                <button type="submit" className={styles.createProductButton}>Создать товар</button>
            </form>
        </div>
    );
}