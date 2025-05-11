# 📝 Note Taking App – Full Stack AWS Deployment

A full-stack note-taking app that lets users register, log in, and manage personal notes. Built using **React**, **Flask**, and **PostgreSQL**, and deployed with **Docker on EC2**, **Elastic Beanstalk**, and **RDS**.

---

## ⚙️ Tech Stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Frontend   | React (served with `serve`)                           |
| Backend    | Flask (Dockerized on EC2)                             |
| Database   | PostgreSQL on AWS RDS                                 |
| Auth       | JWT-based authentication (`Flask-JWT-Extended`)       |
| Deployment | Backend: Docker on EC2<br>Frontend: Elastic Beanstalk |

---

## ✨ Features

- User registration and login with password hashing
- Authenticated note creation, reading, updating, and deleting
- User-specific access (users can only see their own notes)
- Secure JWT token storage and validation
- Responsive and styled React frontend
- Complete AWS deployment pipeline

---

## 📁 Project Structure

```
project-root/
│
├── backend/                     # Flask backend (Dockerized)
│   ├── backend.py               # Flask application
│   ├── requirements.txt         # Backend dependencies
│   └── Dockerfile               # Dockerfile for EC2 deployment
│
├── frontend/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── Notes.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   └── api.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Deployment Instructions

### 🐳 Backend (Flask in Docker on EC2)

1. **Update Flask app (`backend.py`)**:

   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://noteadmin:Jazzy.12345@<rds-endpoint>:5432/<dbname>'
   ```

2. **Dockerfile**:

   ```dockerfile
   FROM python:3.9-slim

   WORKDIR /app

   COPY requirements.txt requirements.txt
   RUN pip install -r requirements.txt

   COPY . .

   CMD ["python", "backend.py"]
   ```

3. **Build and run on EC2**:

   ```bash
   docker build -t noteapp-backend .
   docker run -d -p 5000:5000 noteapp-backend
   ```

4. **Ensure port 5000 is open** in your EC2 security group

---

### 🗄️ Database (PostgreSQL on AWS RDS)

- DB Name: `jahanzeb_abdullah_db`
- Endpoint: `jahanzeb-abdullah-db.chkocg22cbbj.eu-north-1.rds.amazonaws.com`
- Ensure EC2 security group is allowed on port `5432`

---

### 🌐 Frontend (React on Elastic Beanstalk)

1. **Build the frontend**:

   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **In `build/`, create `package.json`**:

   ```json
   {
     "scripts": {
       "start": "serve -s ."
     },
     "dependencies": {
       "serve": "^14.2.0"
     }
   }
   ```

3. **Install `serve`**:

   ```bash
   npm install serve
   ```

4. **Zip contents of `build/`**:

   ```bash
   zip -r react-app.zip *
   ```

5. **Deploy to Beanstalk**:

   - Create Node.js environment
   - Upload `react-app.zip`
   - Access the public URL

6. **Update `api.js` in React**:
   ```js
   const API = axios.create({
     baseURL: "http://<your-ec2-ip>:5000",
   });
   ```

---

## 🔐 Environment Notes

| Component  | Configuration                             |
| ---------- | ----------------------------------------- |
| EC2        | Flask API runs on port 5000 (open SG)     |
| RDS        | PostgreSQL accessible by EC2 SG           |
| Beanstalk  | React app served on Node.js               |
| CORS       | Enabled via `Flask-CORS`                  |
| JWT Secret | Stored in Flask config (`JWT_SECRET_KEY`) |

---

## ☁️ Cloud Deployment Architecture

### VPC: `project-vpc`

```
project-vpc/
├── Subnet 1 (Private)
│   ├── EC2 Instance (Dockerized Flask Backend)
│   └── RDS Instance (PostgreSQL)
│
└── Subnet 2 (Public)
    ├── Elastic Beanstalk EC2 Instance (React App)
    └── Connected S3 Bucket (static assets, optional)
```

### Key AWS Resources:

- **EC2**: Runs Flask backend in Docker container
- **RDS**: PostgreSQL database
- **Elastic Beanstalk**: Deploys production-ready React build
- **S3 (optional)**: Used by EB or manually for static files
- **IAM Roles**: For EC2 and EB access
- **Security Groups**:
  - Allow EB to access EC2 on port 5000
  - Allow EC2 to access RDS on port 5432
  - Allow internet access to EB

---

## 👨‍💻 Author

**Jahanzeb Khan, Abdullah Bin Masood**  
Secure, Dockerized, Full-Stack Deployment on AWS  
© 2025
