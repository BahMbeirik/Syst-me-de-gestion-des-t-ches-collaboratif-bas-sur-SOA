import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const AddProject = () => {
  const [name, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios.post('http://localhost:8000/api/projects/', { name, description },
      {
        headers: {
          Authorization: `Token ${token}` 
        }
      }
    )
      .then(response => {
        navigate('/projects'); 
        toast.success("Le projet et bien ajouter!");
      })
      .catch(error => {
        console.error('حدث خطأ أثناء إضافة المشروع!', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h5>Add New Project</h5>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Name
        </label>
        <input
         type="text"
         className="form-control"
         id="exampleFormControlInput1"
         placeholder="Enter project's name"
         value={name}
         onChange={(e) => setTitle(e.target.value)}
         required
       />
     </div>
     <div className="mb-3">
      <label htmlFor="exampleFormControlInput1" className="form-label">
        Desctiption
      </label>
        <textarea 
          className="form-control"
          id="exampleFormControlTextarea1"
          rows={4}
          placeholder=" Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>
      <button type="submit"
        className="btn btn-primary d-flex justify-content-center"
        style={{ width: "100%" }}
      >
        Add Project
      </button>
      </form>
    </div>
  );
};

export default AddProject;
