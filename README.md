# 🚌 e-Bus Pass Application

The **e-Bus Pass App** is a full-stack web application that digitalizes the process of applying, approving, and managing bus passes for students.  
It provides **two roles**: **Client (Students)** and **Admin**.  
Built with **Vite**, **Tailwind CSS**, **Express.js**, and **Stripe**, it ensures a smooth, secure, and paperless experience.

---

## ✨ Features

### 👨‍🎓 Students (Client)
- 🔑 **Signup & Login** – Register and access the system.
- 🎫 **Book Pass** – Choose source and destination to apply for a bus pass.
- 📅 **Pass Types** – Weekly, Monthly, or Yearly passes.
- 📍 **Dynamic Pricing** – Price calculated based on distance between source and destination.
- 💳 **Secure Payments** – Stripe integration for online payment.
- ⏳ **Approval Workflow** – Pass request awaits admin approval.
- 📲 **Digital Pass with QR Code** – Once approved, students can download a pass with a scannable QR code.

### 🛠️ Admin
- 🖥️ **Admin Dashboard** – Manage all pass requests.
- ✅ **Approve or Decline Requests** – Control student applications.
- 👨‍✈️ **Driver Management** – Add and manage bus drivers.
- 🔍 **Pass Validation** – Validate student passes using QR codes.

---

## 🏗️ Tech Stack
- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Express.js](https://expressjs.com/) (Node.js)
- **Database**: *(Add your DB here: MongoDB / MySQL / PostgreSQL)*
- **Payment Gateway**: [Stripe](https://stripe.com/)
- **Authentication**: *(JWT / Sessions – mention what you used)*
- **QR Code Generator**: Node.js QR library

---

## 🚀 How It Works
1. Student signs up and applies for a pass.
2. System calculates fare based on distance and pass type.
3. Student completes payment via Stripe.
4. Admin reviews and **approves or declines** the request.
5. If approved, student can **download a digital pass with QR code**.
6. Admin/Driver can scan and validate QR passes.

---

## 📂 Project Structure
