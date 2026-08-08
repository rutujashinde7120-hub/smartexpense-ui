# 💰 SmartExpense UI

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Material](https://img.shields.io/badge/Angular%20Material-21-purple?style=for-the-badge)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify)

**A modern and responsive personal finance tracker built with Angular**

[🌐 Live Demo](https://lucent-genie-9d9e78.netlify.app) • [🔧 Backend Repo](https://github.com/rutujashinde7120-hub/smartexpense-api)

</div>

---

## 📸 Screenshots

### Login Page
![Login](https://via.placeholder.com/800x400?text=Login+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)

### Spending Charts
![Charts](https://via.placeholder.com/800x400?text=Spending+Charts)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT based login and registration
- ➕ **Expense Management** — Add, edit and delete expenses easily
- 📅 **Monthly View** — Filter expenses by month and year
- 🎯 **Category Filter** — Filter expenses by category
- 💰 **Budget Tracker** — Set monthly budget with progress bar alerts
- 📊 **Visual Charts** — Pie and bar charts using Chart.js
- 🤖 **AI Categorization** — Auto suggest expense category using Claude AI
- 🧠 **AI Budget Advisor** — Get personalized spending advice
- 📈 **Spending Insights** — Detailed monthly spending analysis
- 📱 **Responsive UI** — Beautiful Material Design interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 |
| Language | TypeScript |
| UI Library | Angular Material |
| Charts | Chart.js |
| HTTP | Angular HttpClient |
| Auth | JWT Token |
| Deployment | Netlify |

---

## 📁 Project Structure
src/app/
├── pages/
│ ├── login/ ← Login page
│ ├── register/ ← Register page
│ ├── dashboard/ ← Main dashboard
│ ├── add-expense/ ← Add/Edit expense
│ └── chart/ ← Charts and insights
├── services/
│ ├── auth.ts ← Authentication service
│ └── expense.ts ← Expense service
├── app.routes.ts ← Routing configuration
└── app.config.ts ← App configuration

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- Angular CLI
- SmartExpense API running on port 8080

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/rutujashinde7120-hub/smartexpense-ui.git
cd smartexpense-ui
```

**2. Install dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Run the application**
```bash
ng serve
```

**4. Open browser at**
http://localhost:4200

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | User login |
| Register | `/register` | New user registration |
| Dashboard | `/dashboard` | Expense dashboard with budget tracker |
| Add Expense | `/add-expense` | Add or edit expense with AI categorization |
| Charts | `/chart` | Spending charts and AI insights |

---

## 🐳 Docker

```bash
docker build -t smartexpense-ui .
docker run -p 80:80 smartexpense-ui
```

---

## 🔗 Related

- 🌐 **Live Demo** — https://lucent-genie-9d9e78.netlify.app
- 🔧 **Backend Repo** — https://github.com/rutujashinde7120-hub/smartexpense-api
- 🚀 **Backend API** — https://smartexpense-api-0izd.onrender.com

---

## 👩‍💻 Developer

**Rutuja Shinde**
- GitHub: [@rutujashinde7120-hub](https://github.com/rutujashinde7120-hub)

---

<div align="center">
⭐ Star this repo if you found it helpful!
</div>

## Backend
This project requires the SmartExpense API (Spring Boot) to be running on port 8080.
Backend repository: https://github.com/rutujashinde7120-hub/