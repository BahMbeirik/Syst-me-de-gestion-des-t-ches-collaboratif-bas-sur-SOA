import React , { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate ,Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [pendingTasksCount, setPendingTasksCount] = useState(0);

  useEffect(() => {
    const fetchPendingTasks = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      axios
        .get("http://127.0.0.1:8001/check_due_tasks/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.tasks) {
            setPendingTasksCount(response.data.tasks.length);
          }
        })
        .catch((err) => {
          console.error("Erreur API :", err);
        });
    };

    fetchPendingTasks();
    const interval = setInterval(fetchPendingTasks, 60000); // تحديث كل 60 ثانية
    return () => clearInterval(interval);
  }, []);


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
        <div className="d-flex" >
        
        <div className="d-flex" style={{marginTop:"6px",marginRight:"16px"}}>
          <FaTasks style={{fontSize:"28px",color:"blue",marginRight:"8px"}}/>
          <Link className="nav-link mt-1" to="/assigned-taches"><b>Mes Tâches</b></Link>
        </div>
        <div className='d-flex' style={{marginTop:"6px"}}>
        <div className="d-flex position-relative" >
          <IoNotificationsCircleOutline style={{fontSize:"30px",color:"blue",marginRight:"8px"}}/>
          {pendingTasksCount > 0 && (
            <span
              className="badge bg-danger position-absolute"
              style={{
                top: "-5px",
                right: "-1px",
                fontSize: "12px",
                padding: "4px 7px",
                borderRadius: "50%",
              }}
            >
              {pendingTasksCount}
            </span>
            
          )}
        </div>
        <Link to="/check_due_tasks" className="nav-link mt-1"><b>Notifications</b></Link>
        </div>    

        </div>
      </div>
      <button className="btn btn-danger btn-md" onClick={handleLogout}>Déconnecter</button>
    </div>
      
    </nav>
    
    <ToastContainer />
    </>
  );
};

export default Navbar;
