# MERN Project Analysis & Documentation

This document provides a comprehensive overview of the **MERN** (MongoDB, Express, React, Node) stack project, including frontend and backend skills, features, and instructions for execution.

---

## 🛠️ Tech Stack & Skills

### 🌐 Frontend Skills (Client-side)
The frontend is built with a modern React stack using **Vite** for optimized development.

- **Library/Framework**: [React](https://reactjs.org/) (v18+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) (Auth Context)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v6)
- **API Communication**: [Apollo Client](https://www.apollographql.com/docs/react/) (GraphQL)
- **Styling**: [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) (Dynamic & Modern)
- **Real-time**: [Socket.io-client](https://socket.io/docs/v4/client-api/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### ⚙️ Backend Skills (Server-side)
The backend is a robust Node.js server utilizing GraphQL for efficient data management.

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5+)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **API Type**: [GraphQL](https://graphql.org/) using [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/), [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Real-time**: [Socket.io](https://socket.io/)
- **DevOps**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)
- **Middleware**: Custom Auth Middleware (Token verification)

---

## 🚀 Core Features

- **User Authentication & Authorization**: 
  - JWT-based login and registration.
  - Secure password hashing using Bcryptjs.
  - Role-based user handling in GraphQL context.
- **Private Routes**: 
  - Protected Dashboard access via custom `PrivateRoute` component.
- **GraphQL Integration**: 
  - Efficient data querying and mutations through a single endpoint.
- **Real-time Synchronization**: 
  - Socket.io integration on both client and server for live communication.
- **Responsive Dashboard**: 
  - Dynamic user interface designed for both performance and aesthetics.
- **Containerization**: 
  - Ready for production/development deployment via Docker.

---

## 📖 Execution Instructions

### Option 1: Manual Execution (Local Environment)

#### 1. Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Create a `.env` file in the `server` root (if not already present).
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
4. Start the server (Development mode):
   ```bash
   npm run dev
   ```

#### 2. Frontend Setup
1. Open another terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application at `http://localhost:5173`.

### Option 2: Docker Execution (Recommended)

Ensure you have **Docker** and **Docker Compose** installed.

1. Navigate to the project root:
   ```bash
   cd Mern
   ```
2. Run the application using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Docker will automatically pull the MongoDB image, build the server, and the client.
4. Access the client at `http://localhost:80`.

---

## 💡 Suggestions for Improvement
- **Validation**: Implement [Zod](https://zod.dev/) or [Joi](https://joi.dev/) for robust backend schema validation.
- **Type Safety**: Consider migrating to **TypeScript** for better developer experience and reduced bugs.
- **Testing**: Add unit tests using **Jest** and **Vitest** for both server and client components.
- **CI/CD**: Set up GitHub Actions for automated deployment pipelines.
