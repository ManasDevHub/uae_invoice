# UAE PINT AE E-Invoicing Validation Engine

Enterprise-grade validation engine aligned with **UAE PINT AE** mandatory field requirements. This platform provides real-time validation, batch processing, and analytics for e-invoice compliance.

## 🚀 Live Deployment (Railway)

This repository is configured for automatic deployment on [Railway](https://railway.app/).

### Quick Start
1.  **Connect to Railway**: Link this GitHub repository to a new project in Railway.
2.  **Environment Variables**: Ensure any required secrets (e.g., `API_KEY`) are added in the Railway dashboard.
3.  **Automatic Build**: Railway will detect the `Dockerfile` and build the unified frontend/backend container.
4.  **Public URL**: Generate a public domain in the Railway settings (under "Public Networking").

## 🛠 Tech Stack
- **Backend**: FastAPI (Python 3.13)
- **Frontend**: React (Vite)
- **Proxy/Web Server**: Nginx
- **Database**: SQLite (managed via SQLAlchemy)
- **Process Manager**: Supervisor

## 📂 Project Structure
- `app/`: FastAPI application logic and API endpoints.
- `frontend/`: React components and dashboard UI.
- `nginx/`: Nginx configuration templates for production routing.
- `rules/`: Compliance rules and business logic for UAE PINT AE.
- `data/`: Sample payloads and reference data.

## 🧪 Testing Locally
To run the validation engine locally (requires Docker):
```bash
docker-compose up --build
```
The app will be available at `http://localhost:80`.

---
*Developed for technical and functional compliance with the UAE E-Invoicing mandate.*
