# Installation and Execution Instructions

### Manual Setup (Local)

1. **Database**: 
   Ensure MongoDB instance is running.
2. **Backend**:
   ```bash
   cd server
   npm install
   # Create .env with MONGO_URI, JWT_SECRET, and PORT
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Docker Setup (Recommended)

Run the following command in the project root:
```bash
docker-compose up --build
```
Access the client at `localhost:80`.
