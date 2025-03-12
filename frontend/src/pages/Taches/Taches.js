import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaSquarePlus } from "react-icons/fa6";
import NoteCard from '../../components/NoteCard';
import './Taches.css';
import Loader from '../../components/Loader';
import Filter from '../../components/Filter';

const Taches = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filtertext, setFilterText] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:8000/api/projects/${id}/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log('Fetched project:', response.data);
        setProjectName(response.data.name);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the project details!', error);
      });

    
    axios.get(`http://localhost:8000/api/projects/${id}/taches/`, {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
      .then(response => {
        console.log('Fetched notes:', response.data);
        setNotes(response.data.notes); 
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the notes!', error);
      });
  }, [id]);

  const handleFilterText = (val) => {
    setFilterText(val);
  };

  const filteredText =
    filtertext === "FINISHED"
      ? notes.filter((note) => note.catagory === "FINISHED")
      : filtertext === "IN PROGRESS" ? notes.filter((note) => note.catagory === "IN PROGRESS")
      : filtertext === "TO DO" ? notes.filter((note) => note.catagory === "TO DO") : notes;

  return (
    <div>
      <div className="d-flex justify-content-around m-4">
        <h3>Tâches du <span className='Pname'>{projectName}</span></h3> 
        <Link to={`/add-taches?project=${id}`} style={{ textDecoration: "none" }}>
              <button className="btn btn-primary btn-md" type="button">
                <FaSquarePlus /> Ajouter une Tâche
              </button>
        </Link>
      </div>
      <Filter handleFilterText={handleFilterText} />
      {isLoading && <Loader loading={isLoading} />}
      <div className='row RN'>
        {filteredText.map((note => <NoteCard key={note.id} note={note} />))}
      </div>
    </div>
  );
};

export default Taches;
