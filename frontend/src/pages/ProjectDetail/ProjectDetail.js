import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/projects/${id}/`, { headers: { Authorization: `Token ${localStorage.getItem('token')}` } })
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the project!', error);
      });
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <div className=" m-5 single-note-item all-category">
        <div className="rounded card card-body m-5 p-5">
          <h1 className="note-title text-truncate mb-0 d-flex justify-content-center" data-noteheading="Book a Ticket for Movie">{project.name}</h1>
          
          <div className="note-content mt-4 mb-4">
              <p className="note-inner-content text-muted" data-notecontent="Blandit tempus porttitor aasfs. Integer posuere erat a ante venenatis.">{project.description}</p>
          </div>
          <Link className='d-flex justify-content-center' to={`/projects/${id}/taches`}><button className="btn btn-primary btn-md " type="button">Voir les Tâches</button></Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
