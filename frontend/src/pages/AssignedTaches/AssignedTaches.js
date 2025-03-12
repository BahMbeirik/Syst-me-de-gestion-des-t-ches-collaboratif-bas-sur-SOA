import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteCard from '../../components/NoteCard';
import Loader from '../../components/Loader';
import { FaTasks } from "react-icons/fa";

const AssignedTaches = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/assigned_taches/', {
      headers: { Authorization: `Token ${localStorage.getItem('token')}` }
    })
    .then(response => {
      setTasks(response.data);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching assigned tasks:', error);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="container">
       <div className="d-flex m-4"> 
       <FaTasks style={{fontSize:"26px",color:"blue",marginRight:"8px"}}/>
       <h4 >Mes Tâches Assignées</h4>
       </div>
      
      {isLoading ? <Loader loading={isLoading} /> : (
        <div className="row">
          {tasks.length > 0 ? (
            tasks.map(task => <NoteCard key={task.id} note={task} />)
          ) : (
            <p className="text-center">Aucune tâche assignée pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedTaches;
