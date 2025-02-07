import React from 'react';
import './Navbar.css';
import { useNavigate ,Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoNotificationsCircleOutline } from "react-icons/io5";
const Navbar = ({searchtext,handleSearchText}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  return (
    
    <>
    <nav className="navbar navbar-expand-lg bg-white py-50" style={{ padding: "20px" }}>
    <Link to="/projects" className="navbar-brand">
      <h4 style={{ fontWeight: "bold" }}>Système de gestion des tâches</h4>
    </Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="container Snav ">
        <div className="d-flex" style={{marginTop:"6px"}}>
          <IoNotificationsCircleOutline style={{fontSize:"30px",color:"blue",marginRight:"8px"}}/>
          <Link to="/check_due_tasks" className="nav-link mt-1">Notifications</Link>
        </div>
          <div className="Sinput d-flex" >
            <div  className=" input-group input-group-sm" style={{ width: "500px", height: "40px" }}  >
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchtext}
                onChange={(e) => handleSearchText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
            {/* <button className="btn btn-outline-primary btn-md" type="button">Add</button> */}
          </div>

          
          <button className="btn btn-danger btn-md" onClick={handleLogout}>Déconnecter</button>
        </div>
      </div>
      
    </nav>
    
    <ToastContainer />
    </>
  );
};

export default Navbar;
