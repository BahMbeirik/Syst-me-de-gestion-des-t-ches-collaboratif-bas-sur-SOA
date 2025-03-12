from fastapi import FastAPI, Depends, HTTPException
import requests
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

app = FastAPI()

# 🔹 تفعيل CORS للسماح للفرونت React بالتواصل مع FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  
    allow_headers=["Authorization", "Content-Type"], 
)

security = HTTPBearer()  # لتفعيل التحقق من التوكن

DJANGO_API_URL = "http://127.0.0.1:8000/api/taches/"  

@app.get("/check_due_tasks/")
def check_due_tasks(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_token = credentials.credentials  # 🔹 الحصول على التوكن الذي أرسله المستخدم من React

    headers = {"Authorization": f"Token {user_token}"}  # 🔹 استخدام التوكن الخاص بالمستخدم

    try:
        # 🔹 جلب بيانات المستخدم من Django باستخدام التوكن المرسل
        user_response = requests.get("http://127.0.0.1:8000/api/auth/users/me/", headers=headers)
        if user_response.status_code != 200:
            raise HTTPException(status_code=403, detail="⚠️ Token invalide ou expiré.")

        user = user_response.json()  # بيانات المستخدم الحالي

        # 🔹 جلب قائمة المهام من Django مع تمرير نفس التوكن
        response = requests.get(DJANGO_API_URL, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=403, detail="⚠️ Accès refusé aux tâches.")

        tasks = response.json()  # قائمة المهام
        
        today = datetime.today().date()
        reminder_date = today + timedelta(days=1)

        # 🔹 تصفية المهام التي تنتهي غدًا، والتي تعود للمستخدم الحالي فقط
        filtered_tasks = [
            task for task in tasks
            if datetime.strptime(task['due_date'], "%Y-%m-%d").date() == reminder_date
            and (user['is_staff'] or (task['assigned_to'] and task['assigned_to']['id'] == user['id']))
        ]

        return {
            "message": "Tâches qui arrivent à échéance demain",
            "tasks": filtered_tasks
        } if filtered_tasks else {
            "message": "Aucune tâche à échéance demain"
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la communication avec Django: {str(e)}")









# uvicorn notification_service:app --reload --port 8001
