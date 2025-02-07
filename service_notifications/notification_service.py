from fastapi import FastAPI
import requests
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔹 Activer CORS pour permettre au frontend d'accéder à l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Liste sans "/"
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # OPTIONS doit être explicitement permis
    allow_headers=["Authorization", "Content-Type"],  # Autoriser les headers nécessaires
)


# URL de l'API Django pour récupérer les tâches
DJANGO_API_URL = "http://127.0.0.1:8000/api/taches/"
DJANGO_AUTH_TOKEN = "e346ae8a909dcb34abf2dc76ebbc7746acbf152e" 

@app.get("/check_due_tasks/")
def check_due_tasks():
    try:
        # Ajoute le token dans les headers
        headers = {
            "Authorization": f"Token {DJANGO_AUTH_TOKEN}"
        }

        # Récupérer les tâches depuis l'API Django avec authentification
        response = requests.get(DJANGO_API_URL, headers=headers)
        response.raise_for_status()  # Vérifie si l'API retourne une erreur

        tasks = response.json()
        today = datetime.today().date()
        reminder_date = today + timedelta(days=1)
        due_soon_tasks = []

        # Vérifier si une tâche arrive à échéance demain
        for task in tasks:
            due_date = datetime.strptime(task['due_date'], "%Y-%m-%d").date()
            if due_date == reminder_date:
                due_soon_tasks.append(task)

        if due_soon_tasks:
            return {"message": "Tâches qui arrivent à échéance demain", "tasks": due_soon_tasks}
        else:
            return {"message": "Aucune tâche à échéance demain"}

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}








# uvicorn notification_service:app --reload --port 8001
