import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TacheDetailPage.css'
import { formatDate } from "../../components/FormatDate";
import { BiSolidTrashAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { Button,  Form, ListGroup } from "react-bootstrap";
import { FaUserCheck } from "react-icons/fa";
import { LiaCommentDotsSolid } from "react-icons/lia";

const TacheDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState([]);


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

  const handleAssign = async (taskId, userId) => {
    if (!taskId || !userId) {
      alert("Veuillez entrer un ID utilisateur valide !");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/assign_task/${taskId}/`,
        { user_id: userId },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Tâche assignée avec succès !");
    } catch (err) {
      alert("Erreur lors de l’assignation !");
    }
  };
  

  const handleAddComment = async (taskId) => {
    if (!newComment) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/add_comment/${taskId}/`,
        { content: newComment },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Commentaire ajouté !");
      setNewComment("");
      setNote((prevNote) => ({
        ...prevNote,
        comments: [...prevNote.comments, { id: Date.now(), content: newComment, user: user.username }],
      }));
      
    } catch (err) {
      alert("Erreur lors de l'ajout du commentaire !");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/auth/users/", {
          headers: { Authorization: `Token ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      }
    };
  
    
    fetchUsers();
  }, [id]);
  

  if (!note || !user) return <div>Loading...</div>;

  const userId = user.id ? parseInt(user.id, 10) : null;
  const noteOwner = note.owner ? note.owner.id : null;

  console.log('User ID:', userId);
  console.log('Note Owner:', noteOwner);

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
     <div className="note-footer">
     <p>
     <div className='d-flex'>
      <FaUserCheck style={{fontSize:"20px",color:"blue",marginRight:"8px"}}/>
      <p><strong>Assigné à :</strong> {note.assigned_to ? note.assigned_to.username : "Non assigné"}</p>
     </div>
     </p>
      <p className=" text-muted fw-bold text-end">
        Date de due : {note.due_date}
      </p>
     </div>

     {(user && (user.is_staff || userId === noteOwner)) && (
      <>
     <div className='d-flex justify-content-between'>
     <div className='m-4 w-50'>
     <Form.Group>
        <Form.Select
          value={selectedTask?.userId || ""}
          onChange={(e) => setSelectedTask({ id: note.id, userId: e.target.value })}
        >
          <option value="">Sélectionner un utilisateur</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

    <Button
    className='w-100 mt-2'
      variant="primary"
      onClick={() => handleAssign(selectedTask.id, selectedTask.userId)}
    >
      Assigner
    </Button>
     </div>

     <div className='w-50 m-4'>
      
      {/* Ajouter un commentaire */}
      <Form.Group className="">
        <Form.Control
          type="text"
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </Form.Group>
      <Button variant="success" className="mt-2 w-100" onClick={() => handleAddComment(note.id)}>
        Ajouter Commentaire
      </Button>
      </div>
      </div>
      </>
      )}
      {/* Afficher les commentaires */}
      <ListGroup className="mt-3">
        <div className="d-flex">
          <LiaCommentDotsSolid style={{fontSize:"30px",color:"green",marginRight:"8px"}}/>
          <h5>Commentaires</h5>
        </div>
        {note.comments.map((comment) => (
          <ListGroup.Item key={comment.id}>
            {comment.content} - {comment.user ? comment.user.username : "Utilisateur inconnu"}
          </ListGroup.Item>
        ))}
      </ListGroup>

    </div>
  );
};

export default TacheDetail;

