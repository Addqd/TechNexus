import styles from "./ProductConstructor.module.css";
import ReturnBackBtn from "../ReturnBackBtn/ReturnBackBtn";
import Notification from "../Notification/Notification";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import crossInCircle from "../assets/cross-in-circle.svg";
import Cookies from "js-cookie";
import Select from "react-select";

export default function ProductConstructor() {

    const [showLimitNotification, setShowLimitNotification] = useState(false);
    const [showInvalidTypeNotification, setShowInvalidTypeNotification] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showFailNotification, setShowFailNotification] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [failMsg, setFailMsg] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProducer, setSelectedProducer] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState([]);
    const [thumnbnails, setThumbnails] = useState([]);
    const [producers, setProducers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [description, setDescription] = useState("");
    

    const [previewImgData,  setPreviewImgData] = useState({
        fileName: "/images/testImage.jpg",
        preview: null,
        file: null
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

    const navigate = useNavigate();
    
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

    // Fetch data for constructor
    useEffect(() => {
        const fetchConstructorData = async () => {
            try {
                const response = await fetch("http://localhost:8000/product-constructor-data");
                if (response.ok) {
                    const data = await response.json();

                    setProducers(data.producers.map(p => ({
                        value: p.id,
                        label: p.producer_name
                    })));

                    setCategories(data.categories.map(c => ({
                        value: c.id,
                        label: c.category_name
                    })));

                    setAttributes(data.attributes);
                }
                else {
                    const errorData = await response.json();
                    console.error(errorData.error);
                }
            }
            catch (error) {
                console.error(error);
            }
        };
        
        fetchConstructorData();
    }, []);

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
                preview: objectURL,
                file: file
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
                preview: preview,
                file: file
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
        setSelectedAttributes([]);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    // Filtered array of attributes
    const filteredAttributes = selectedCategory
    ? attributes.filter(attr => attr.category_id === selectedCategory.value)
    : [];

    // Handle product creation
    const handleCreateProductFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        const user_id = Cookies.get("userId");

        formData.append("user_id", user_id);

        if (
            !e.target.product_name.value.trim() || 
            !selectedCategory.value || 
            !selectedProducer.value || 
            !e.target.description.value.trim() || 
            !e.target.price.value.trim() || 
            selectedAttributes.length === 0 
        ) {
            setShowFailNotification(true);
            setFailMsg("Заполните все обязательные поля, как минимум одну пару атрибут-значение и загрузите главное изображение");
            return;
        }

        formData.append("product_name", e.target.product_name.value.trim());
        formData.append("producer_id", selectedProducer.value);
        formData.append("description", e.target.description.value.trim());
        formData.append("category_id", selectedCategory.value);
        formData.append("attributes", JSON.stringify(selectedAttributes));
        formData.append("price", e.target.price.value.trim());

        if (previewImgData?.file) {
            formData.append('mainImage', previewImgData.file);
        }

        thumnbnails.forEach((thumb) => {
            if (thumb.file) {
                formData.append("images", thumb.file);
            }
        });

        try {
            const response = await fetch("http://localhost:8000/create/product", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setShowSuccessNotification(true);
                setSuccessMsg(data.message);
            }
            else {
                const errorData = await response.json();
                setShowFailNotification(true);
                setFailMsg(errorData.message || errorData.error);
            }
        }
        catch (error) {
            console.error(error);
        }
        
    };   

    return (
        <div className={styles.constructorFormWrapper}>
            <form className={styles.constructorForm} onSubmit={handleCreateProductFormSubmit}>
                <ReturnBackBtn />
                <span style={{"marginBottom" : "30px", "fontSize": "24px"}}>Создание товара</span>
                <span>Название</span>
                <input
                    type="text" 
                    name="product_name"
                    placeholder="Введите название товара..."
                    className={styles.inputField}
                    style={{ "width": "300px" }}
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
                {showSuccessNotification &&
                    <Notification 
                        message={successMsg}
                        onClose={() => {
                            setShowSuccessNotification(false);
                            setSuccessMsg("");
                            navigate(-1);
                        }}
                    />
                }
                {showFailNotification &&
                    <Notification 
                        message={failMsg}
                        onClose={() => {
                            setShowFailNotification(false);
                            setFailMsg("");
                        }}
                    />
                }
                <span>Производитель</span>
                <Select
                    options={producers}
                    styles={customStyles} 
                    placeholder="Выберите производителя..."
                    name="producer"
                    value={selectedProducer}
                    onChange={setSelectedProducer}
                    isSearchable={false}
                />
                <span>Описание</span>
                <div className={`${styles.textareaContainer} ${styles.scrollbarStyle}`}>
                    <textarea 
                        name="description"
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
                    options={categories} 
                    styles={customStyles} 
                    placeholder="Выберите категорию..."
                    name="category_name"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    isSearchable={false}
                />
                <span>Характеристики</span>
                <div className={`${styles.characteristicsContainer} ${styles.scrollbarStyle}`}>
                    {filteredAttributes.map((attribute, index) => (
                        <div key={attribute.attribute_id} className={styles.characteristicsWrapper}>
                            <Select 
                                option={[{ value: attribute.attribute_id, label: attribute.attribute_name }]}
                                value={{ value: attribute.attribute_id, label: attribute.attribute_name }}
                                styles={customStyles}
                                isDisabled={true}
                            />

                            <Select
                                options={attribute.values.map(val => ({
                                    value: val.value_id,
                                    label: val.attribute_value
                                }))}
                                styles={customStyles}
                                placeholder="Выберите значение..."
                                name={`attribute_value_${attribute.attribute_id}`}
                                value={
                                    selectedAttributes.find(a => a.attribute_id === attribute.attribute_id)
                                        ? {
                                            value: selectedAttributes.find(a => a.attribute_id === attribute.attribute_id).value_id,
                                            label: selectedAttributes.find(a => a.attribute_id === attribute.attribute_id).label
                                        }
                                        : null
                                }
                                onChange={(selectedOption) => {
                                    setSelectedAttributes(prev => {
                                        const other = prev.filter(a => a.attribute_id !== attribute.attribute_id);
                                        return [
                                            ...other,
                                            {
                                                attribute_id: attribute.attribute_id,
                                                value_id: selectedOption.value,
                                                label: selectedOption.label
                                            }
                                        ];
                                    });
                                }}
                                isSearchable={false}
                            />
                        </div>
                    ))}
                </div>
                <span style={{ "fontSize": "16px" }}>
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