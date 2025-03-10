# 🎓 Online Mentorship Platform

Online Mentorship is a web application designed to connect mentors and mentees. The platform enables users to book mentorship sessions, communicate via real-time chat, Mentors can set availability, while mentees can search for the right mentors based on expertise.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

---

## **🚀 Features**
- **User Authentication & Authorization** (JWT-based login & registration)
- **Role-Based Access Control** (Mentor & Mentee functionalities)
- **Mentorship Session Booking** (Mentors set availability, mentees Book sessions)
- **Real-Time Chat** (Instant messaging using WebSockets)
- **Review & Rating System** (Mentees can review and rate mentors)
- **Admin Dashboard** (Manage users, sessions, and reviews)
- **Responsive UI** (Built with React.js, Redux Toolkit, and Material-UI)

---

## **🛠️ Technologies Used**
### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Backend framework
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Secure authentication
- **WebSockets (Socket.io)** - Real-time messaging
- **Multer** - File uploads (profile pictures, documents)
- **Nodemailer** - Email notifications

### **Frontend**
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Material-UI** - UI styling

---

## **📦 Getting Started**

### **Prerequisites**
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based via MongoDB Atlas)
- A terminal or command prompt

---

### **Back-end Installation**
#### 1️⃣ Clone the Backend repository:
```sh
git clone https://github.com/adel-eleraky/online_mentorship.git
cd online_mentorship
```
#### 2. Install the dependencies:
```sh
npm install
```
#### 3. Set up environment variables:

Create a `.env` file in the root of your project and add the following variables (modify according to your setup):
    
```sh
    
PORT=3000
JWT_SECRET=my_json_web_token_secret

NODEMAILER_EMAIL=your_gmail
NODEMAILER_EMAIL_PASSWORD=your_gmail_app_password

STRIPE_SECRET_KEY=stripe_secret_key
STRIPE_PUBLIC_KEY=stripe_public_key
STRIPE_WEBHOOK_SECRET=stripe_webhook
```

#### 4. Start the API server:
```sh
npm run dev
```

### **Front-end Installation**
#### 1️⃣ Clone the Backend repository:
```sh
git clone https://github.com/adel-eleraky/mentorship_frontend.git
cd mentorship_frontend
```
#### 2. Install the dependencies:
```sh
npm install
```

#### 3. Start the Frontend:
```sh
npm run dev
```
