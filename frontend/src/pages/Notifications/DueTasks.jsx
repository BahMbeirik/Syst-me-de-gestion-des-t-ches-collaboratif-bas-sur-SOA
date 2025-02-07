import React, { useState, useEffect } from "react";
import axios from "axios";

const DueTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Vérifie si le token existe
    if (!token) {
      setError("⚠️ Vous devez être connecté !");
      setLoading(false);
      return;
    }

    axios
      .get("http://127.0.0.1:8001/check_due_tasks/", {
        headers: { Authorization: `Token ${token}` },
      })
      .then((response) => {
        if (response.data.tasks) {
          setTasks(response.data.tasks);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError("Erreur lors de la récupération des tâches !");
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mt-4 " >
      <h3 className="mb-5 text-primary">📅 Tâches en attente (J-1)</h3>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-text">{task.body}</p>
                  <p className="text-danger fw-bold">📅 Échéance : {task.due_date}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">Aucune tâche en attente.</p>
        )}
      </div>
    </div>
  );
};

export default DueTasks;
