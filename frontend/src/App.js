import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthPage from './pages/AuthPage'
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Projects from './pages/Projects/Projects';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import Taches from './pages/Taches/Taches'
import AddProject from './pages/AddProject/AddProject';
import AddTache from "./pages/AddTache/AddTachePage";
import TacheDetail from "./pages/TacheDetail/TacheDetailPage";
import TacheEditPage from "./pages/EditTache/EditTachePage";
import DueTasks from "./pages/Notifications/DueTasks";
function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true)
    axios.get('http://localhost:8000/api/projects/', { 
      headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
      .then(response => {
        setProjects(response.data);
        
        setIsLoading(false)
      })
      .catch(error => {
        console.error('There was an error fetching the projects!', error);
      });
  }, []);
  

  const handleSearchText = (val) =>{
    setSearchTerm(val);
  }
  const handleSetProject = (val) =>{
    setProjects(val);
  }
  return (
      <Router>
        <>
          <Routes>
            {/* صفحات بدون sidebar و navbar */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password-confirm" element={<ResetPassword />} />
          {/* صفحات مع sidebar و navbar */}
          <Route
            path="/*"
            element={
              <>
                <Navbar searchtext={searchTerm} handleSearchText={handleSearchText}/>
                
                <div >
                <Routes >
                <Route path="/taches/:id/edit" element={<TacheEditPage />} />
                <Route path="/taches/:id" element={<TacheDetail />} />
                <Route path="/add-taches" element={<AddTache />} />
                <Route path="/" element={<Projects searchTerm={searchTerm} isLoading={isLoading} projects={projects} handleSetProject={handleSetProject}/>} />
                <Route path="/projects" element={<Projects searchTerm={searchTerm} isLoading={isLoading} projects={projects} handleSetProject={handleSetProject}/>} />
                <Route path="/add-project" element={<AddProject />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/projects/:id/taches" element={<Taches />} />
                <Route path="/check_due_tasks" element={<DueTasks />} />
                </Routes>
                </div>
                
              </>
            }
          />
          </Routes>
        </>
      </Router>
  );
}

export default App;
