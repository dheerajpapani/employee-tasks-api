# Employee Tasks API & Minimal Frontend UI

A clean and production-ready **Employee & Task management API** with a **vanilla-JS frontend UI**, deployed on **Render**.  
Supports employee listing with pagination, task assignment, task deletion, and additional UI-only enhancements such as marking tasks "done" before deletion.

---

## 🚀 Live Demo

### 🔹 Frontend + Backend (served together by Express on Render)
👉 **https://employee-tasks-api.onrender.com/**  
(This serves both the UI from `/public` and the API under `/api`.)

### 🔹 Health Check  
👉 **https://employee-tasks-api.onrender.com/api/health**

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | **Node.js**, **Express.js** |
| Database | **MongoDB Atlas** (via native MongoDB driver – no Mongoose) |
| Frontend | **Static HTML + Vanilla JS + CSS** (no frameworks) |
| Hosting | **Render Web Service** |
| Version Control | **Git + GitHub** |
| Tools | `nodemon` (dev), `dotenv` |

---

## 📁 Project Structure

```

employee-tasks-api/
│
├── src/
│   ├── index.js              # Express server root
│   ├── db/
│   │   └── mongo.js          # MongoDB connection
│   ├── controllers/
│   │   ├── employeesController.js
│   │   └── tasksController.js
│   ├── routes/
│   │   ├── employees.js
│   │   └── tasks.js
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── ApiResponse.js
│   └── seed/
│       └── seed.js           # Seeder script (1000 employees)
│
├── public/
│   ├── index.html            # Frontend UI
│   └── styles.css            # Clean responsive CSS
│
├── .gitignore
├── package.json
└── README.md

````

---

## 🛠️ Local Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/dheerajpapani/employee-tasks-api.git
cd employee-tasks-api
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set environment variables

Create `.env` in root:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/employee_tasks_db?retryWrites=true&w=majority
PORT=3000
```

### 4️⃣ Run locally

```bash
npm run dev
```

Local URLs:

* UI → [http://localhost:3000](http://localhost:3000)
* API → [http://localhost:3000/api](http://localhost:3000/api)
* Health → [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🌱 Seed the Database (1000 Employees)

The project includes a CLI seeder that inserts 1000 realistic employees.

### Run seeder:

```bash
node src/seed/seed.js
```

Make sure `MONGODB_URI` is valid before running it.

---

## 📡 API Endpoints

### Employees

| Method   | Endpoint                             | Description                   |
| -------- | ------------------------------------ | ----------------------------- |
| `GET`    | `/api/employees?page=1&q=searchTerm` | Paginated employees (50/page) |
| `GET`    | `/api/employees/:id`                 | Get employee                  |
| `GET`    | `/api/employees/:id/tasks`           | Tasks for this employee       |
| `POST`   | `/api/employees`                     | Create employee               |
| `PUT`    | `/api/employees/:id`                 | Update employee               |
| `DELETE` | `/api/employees/:id`                 | Remove employee               |

### Tasks

| Method   | Endpoint                   | Description  |
| -------- | -------------------------- | ------------ |
| `GET`    | `/api/tasks?assignee=<id>` | Filter tasks |
| `POST`   | `/api/tasks`               | Create task  |
| `PUT`    | `/api/tasks/:id`           | Update task  |
| `DELETE` | `/api/tasks/:id`           | Delete task  |

---

## 🎨 Frontend Features

* BA lightweight employee & task manager with search, pagination, live task loading, and responsive UI.  
* Tasks support mark-as-done + safe delete, and the entire interface updates instantly with a global loading spinner.

---


## ☁️ Deployment (Render)

### Render Service Config:

| Setting               | Value         |
| --------------------- | ------------- |
| Environment           | Node          |
| Build Command         | `npm install`    |
| Start Command         | `npm start`   |
| Root Directory        | *empty*           |
| Health Path           | `/api/health` |
| Environment Variables | `MONGODB_URI` |

### Single Render URL:

```
https://employee-tasks-api.onrender.com/
```

Frontend & backend bundled together.

---

## 🤝 Contributing

PRs welcome.
Open an issue for suggestions or bugs.

---

## 📄 License

MIT — free to use, modify, distribute.
