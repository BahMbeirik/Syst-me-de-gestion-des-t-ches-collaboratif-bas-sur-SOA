/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect ,useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSquarePlus } from "react-icons/fa6";
import Loader from '../../components/Loader'
const Projects = () => {

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
  
  useEffect(() => {
    if (searchTerm) {
      axios.get(`http://localhost:8000/api/projects/?search=${searchTerm}`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          handleSetProject(response.data);
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
        });
    }
  }, [searchTerm]);

  

  return (
    <div>
      <div className="d-flex justify-content-around m-4 ">
        <h3>Les projets</h3>
        <div className="Sinput d-flex" >
            <div  className=" input-group input-group-sm" style={{ width: "500px", height: "40px" }}  >
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => handleSearchText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </div>
            {/* <button className="btn btn-outline-primary btn-md" type="button">Add</button> */}
          </div>
        <Link to="/add-project" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary btn-md" type="button">
                <FaSquarePlus />Ajouter un Projet
              </button>
        </Link>
      </div>
      {isLoading && <Loader loading={isLoading} />}
      <div className=" single-note-item all-category m-4 d-flex  flex-wrap">
          
          {projects.map(project => (
            <div className=" card card-body m-4 rounded shadow-sm border border-4 border-primary border-bottom-0 border-end-0" style={{maxWidth: "22rem"}}>
              <div key={project.id}>
                <h5 className="note-title text-truncate mb-0" data-noteheading="Book a Ticket for Movie"><Link className="T" to={`/projects/${project.id}`}>{project.name}</Link></h5>
                <div className="note-content mt-2">
                  <p className="note-inner-content text-muted" data-notecontent="Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.">{`${project.description.split(" ").slice(0,10).join(" ")} ...`}</p>
                </div>
              
              </div>
            </div>

            
          ))}
          
        
        </div>
        
    </div>
  );
};

export default Projects;
