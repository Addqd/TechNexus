import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import ProductPage from "./Pages/ProductPage/ProductPage.jsx";
import UserProfile from "./UserProfile/UserProfile.jsx";
import ProductConstructor from "./ProductConstructor/ProductConstructor.jsx";
import BrandProducts from "./BrandProducts/BrandProducts.jsx";
import CategorizedHomePage from "./Pages/CategorizedHomePage/CategorizedHomePage.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

export default function App() {

  return (
      <Router>
        
        <Header /> 
          <div style={{ marginTop: "30px", marginBottom: "30px" }}>
            <Routes>

              {/* Home Page */}
              <Route path="/" element={<HomePage />}/>

              {/* Product page */}
              <Route path="/product/:id" element={<ProductPage />}/>

              {/* User profile */}
              <Route path="/profile/:user_id" element={<UserProfile/>}/>

              {/* Product constructor */}
              <Route path="/constructor" element={<ProductConstructor/>}/>

              {/* Brand products */}
              <Route path="/brand_products/:brand_id" element={<BrandProducts/>}/>

              {/* Search Results */}
              <Route path="/category/:category_name" element={<CategorizedHomePage />} />

            </Routes>
          </div>
        <Footer />  
      </Router>
  )
}