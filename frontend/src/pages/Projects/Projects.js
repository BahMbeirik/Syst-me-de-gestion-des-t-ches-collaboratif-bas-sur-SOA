import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSquarePlus } from "react-icons/fa6";
import Loader from '../../components/Loader'
const Projects = ({searchTerm,isLoading ,projects,handleSetProject}) => {
  
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
        <Link to="/add-project" style={{ textDecoration: "none" }}>
              <button className="btn btn-primary btn-md" type="button">
                <FaSquarePlus />Ajouter un Projet
              </button>
        </Link>
      </div>
      {isLoading && <Loader loading={isLoading} />}
      <div className=" single-note-item all-category m-4 d-flex">
          
          {projects.map(project => (
            <div className="col-md-9 card card-body m-4 rounded">
            <div key={project.id}>
            <h5 className="note-title text-truncate w-75 mb-0" data-noteheading="Book a Ticket for Movie"><Link className="T" to={`/projects/${project.id}`}>{project.name}</Link></h5>
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
