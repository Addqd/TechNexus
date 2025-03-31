import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage.jsx";
import ProductPage from "./Pages/ProductPage/ProductPage.jsx";
import UserProfile from "./UserProfile/UserProfile.jsx";
import Header from "./Header/Header.jsx";
import Footer from "./Footer/Footer.jsx";

// Figure out how to deploy on https or even only deploy an app in the first place, 
// add security, (?)payment processing(?).

//Total workload: guess, 1.5 months.

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

            </Routes>
          </div>
        <Footer />  
      </Router>
  )
}