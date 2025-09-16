# 🚗 AutoTrust - Plataforma de Venta de Carros Usados

Proyecto fullstack con **Django (backend)** y **React + Vite + Tailwind CSS (frontend)**.

---

## 📂 Estructura del proyecto
```
django-AutoTrust/
│── backend/       # API en Django
│── frontend/      # React + Vite
│── requirements.txt
│── README.md
```

---

## ⚙️ Backend (Django)

### 🔹 Requisitos
- Python 3.10+
- pipenv o venv recomendado

### 🔹 Instalación
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate    # Windows

pip install -r ../requirements.txt
```

### 🔹 Migraciones y ejecución
```bash
python manage.py migrate
python manage.py createsuperuser   # crear admin
python manage.py runserver
```

El backend correrá en:
```
http://127.0.0.1:8000
```

---

## 🎨 Frontend (React + Vite + Tailwind)

### 🔹 Requisitos
- Node.js 18+
- npm o yarn

### 🔹 Instalación
```bash
cd frontend
npm install
```

### 🔹 Ejecutar en desarrollo
```bash
npm run dev
```

La app estará en:
```
http://127.0.0.1:5173
```

---

## 🌐 Conexión Frontend ↔ Backend
- Asegúrate de configurar **CORS** en `settings.py`:
```python
INSTALLED_APPS = [
    ...
    "corsheaders",
    "rest_framework",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOW_ALL_ORIGINS = True  # solo para desarrollo
```

- En React, apunta tus fetch/axios a `http://127.0.0.1:8000/api/`.

---



