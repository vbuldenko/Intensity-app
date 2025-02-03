# Fitness Studio App - "INTENSITY"

This project is a fully responsive fullstack web application for managing a fitness studio. It provides features for user interaction, data management, and localization, utilizing modern technologies for both the front-end and back-end development.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup Steps](#setup-steps)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Secure Authentication**: JWT-based authentication for secure user login and session management.
- **Password Recovery**: Secure password reset via email or OTP verification.
- **Role-Based Access Control (RBAC)**:
	•	Clients can book training sessions based on studio rules and available subscriptions.
	•	Trainers manage their schedules and assigned training sessions.
	•	Admins oversee user management, training schedules, and subscription plans.
- **Dashboard Analytics**: Admins and trainers get insights into bookings, and revenue.
- **UI**: Responsive design for mobile, tablet and desktop devices.
- **Multi-language support**: (Uk, En).
- **Data persistence**: MongoDB integration via Mongoose.

---

## Technologies Used

### Front-End

- **Typescript**: For code type safety.
- **React**: For building dynamic user interfaces.
- **Custom React Hooks**: For better readability and logic reuse.
- **Redux & Redux Toolkit**: For state management.
- **Async Thunks**: For handling asynchronous operations.
- **React Router v6**: For routing and navigation.
- **Localization**: Managed using `react-i18next`.
- **Styling**: Combination of SCSS and Tailwind CSS for flexible and modern UI design.

### Back-End

- **Typescript**: For code type safety.
- **Express**: Lightweight framework for building the server-side application.
- **Routes, Controllers, and Services**: For organizing server-side code.
- **MongoDB & Mongoose**: For database operations and schema modeling.
- **Nodemailer**: For sending mails.

---

## Installation

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- MongoDB (Ensure it is installed and running)

### Setup Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vbuldenko/Intensity-app.git
   cd Intensity-app
   ```

2. **Install dependencies:**

   - Front-end dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Back-end dependencies:
     ```bash
     cd backend
     npm install
     ```

3. **Configure environment variables:**

   - Rename the `.env.example` file to `.env` in both the `backend` and `frontend`.
   - Add the following variables:

     ```env
      NODE_ENV=development
      PORT=3001

      MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
      DEV_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
      TEST_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority

      CLIENT_HOST=https://your-production-client-url.com

      SMTP_HOST=smtp.gmail.com
      SMTP_PORT=587
      SMTP_USER=your-email@gmail.com
      SMTP_PASSWORD=your-email-password

      JWT_KEY=your-jwt-key
      JWT_REFRESH_KEY=your-jwt-refresh-key
      JWT_ACCESS_SECRET=your-jwt-access-secret
      JWT_REFRESH_SECRET=your-jwt-refresh-secret

      GOOGLE_CLIENT_ID=your-google-client-id
      GOOGLE_CLIENT_SECRET=your-google-client-secret
     ```

4. **Run the application:**

   - Start both front-end and back-end development servers from root directory:
     ```bash
     npm run dev
     ```

5. **Access the application:**
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## License

This project is licensed under the MIT License. Copyright (c) 2025 Vladyslav Buldenko.
