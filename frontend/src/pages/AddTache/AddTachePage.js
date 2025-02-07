import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

const AddTache = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [catagory, setCatagory] = useState('TO DO');
  const [due_date, setDueDate] = useState('');
  const [project, setProject] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const projectId = params.get('project');
    if (projectId) {
      setProject(projectId);
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post('http://localhost:8000/api/taches/', 
      { 
        title, 
        body, 
        catagory, 
        due_date,
        project 
      }, 
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
    .then(response => {
      navigate(`/projects/${project}/taches`);
      toast.success("Le projet est bien ajouté!");
    })
    .catch(error => {
      console.error( error.response.data);
      alert(JSON.stringify(error.response.data));
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
       <h5>Ajouter une Sprint</h5>
       <div className="mb-3">
         <label htmlFor="exampleFormControlInput1" className="form-label">
           Title
         </label>
         <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Enter note's title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Content
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={4}
          placeholder="Enter note's content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          Sprint's status
        </label>
        <select
          className="form-select"
          aria-label="Default select example"
          value={catagory}
          onChange={(e) => setCatagory(e.target.value)}
          required
          style={{ height: "40px" }}
        >
          <option value="" selected>Pick a Status</option>
          <option value="FINISHED">finished</option>
          <option value="IN PROGRESS">in progress</option>
          <option value="TO DO">to do</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
        Date de due
        </label>
        <input
          type="date"
            className="form-control"
          id="exampleFormControlInput1"
          placeholder="Date de due"
          value={due_date}
          onChange={(e) => setDueDate(e.target.value)}
          required
         />
      </div>
      
      <button type="submit"
        className="btn btn-primary d-flex justify-content-center"
        style={{ width: "100%" }}
      >
        Ajouter
      </button>
    </form>
    </div>
  );
};

export default AddTache;
