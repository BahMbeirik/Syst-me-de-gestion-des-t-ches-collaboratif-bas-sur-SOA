import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TacheDetailPage.css'
import { formatDate } from "../../components/FormatDate";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
const TacheDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNote = async () => {
      try {
        // Fetch the current user
        const userResponse = await axios.get('http://localhost:8000/api/auth/users/me/', {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        console.log('Fetched user:', userResponse.data);
        setUser(userResponse.data);

        // Fetch the note details
        const noteResponse = await axios.get(`http://localhost:8000/api/taches/${id}/`, {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` }
        });
        console.log('Fetched note:', noteResponse.data);
        setNote(noteResponse.data);
      } catch (error) {
        console.error('Error fetching user or note details:', error);
      }
    };

    fetchUserAndNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/taches/${id}/`, {
        headers: { Authorization: `Token ${localStorage.getItem('token')}` }
      });
      navigate(`/projects/${note.project}`); // Navigate back to the project's notes list after deletion
    } catch (error) {
      console.error('Error deleting the note:', error);
    }
  };

  if (!note || !user) return <div>Loading...</div>;

  const userId = user.id ? parseInt(user.id, 10) : null;
  const noteOwner = note.owner ? parseInt(note.owner, 10) : null;

  return (
    <div className="note-container">
      <h3 className="title">{note.title}</h3>
      <span className="d-flex justify-content-center">
      <p className="note-date font-12 text-muted me-5"> created: {formatDate(note.created_at)}</p>
      <p className="note-date font-12 text-muted me-5">last updated: {formatDate(note.updated_at)}</p>
     </span>
     <span className="button-group">
        {(user && (user.is_staff || userId === noteOwner)) && (
          <>
            <Link to={`/taches/${note.id}/edit`}><button className="btn btn-primary"><FiEdit /><span>Edit</span></button></Link>
            <button onClick={handleDelete}  className="btn btn-danger" ><BiSolidTrashAlt /><span>Delete</span></button>
          </>
        )}
     </span>
     <p className="description">
       {note.body}
     </p>

     <p className=" text-muted fw-bold text-end">
       Date de due : {note.due_date}
     </p>
    </div>
  );
};

export default TacheDetail;

