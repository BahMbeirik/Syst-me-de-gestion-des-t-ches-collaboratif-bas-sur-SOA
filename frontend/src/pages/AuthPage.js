import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AuthPage = () => {
  const location = useLocation(); // للتعرف على المسار الحالي
  const [activeButton, setActiveButton] = useState(location.pathname); // حالة لتتبع المسار الحالي

  const handleButtonClick = (path) => {
    setActiveButton(path); // تغيير حالة الزر المضغوط
  };

  return (
    <div className={`d-flex justify-content-center p-4 border-5 border-top ${activeButton === '/login' ? 'border-primary' : 'border-secondary'}`}>
      <ToastContainer />
      <div className="d-flex justify-content-center align-items-center text-center">
        <Link style={{width:'300px'}}
          to="/login" 
          className={`btn m-2 ps-5 pe-5 d-flex justify-content-center align-items-center text-center ${activeButton === '/login' ? 'btn-primary' : 'btn-light'}`} 
          role="button"
          onClick={() => handleButtonClick('/login')}
        >
          <b >Login</b> 
        </Link>
        
        <Link style={{width:'300px'}}
          to="/register" 
          className={`btn m-2 ps-5 pe-5 d-flex justify-content-center align-items-center text-center ${activeButton === '/register' ? 'btn-secondary' : 'btn-light'}`} 
          role="button"
          onClick={() => handleButtonClick('/register')}
        >
          <b >Register</b>
        </Link>
      </div>
    </div>
  );
};

export default AuthPage;
