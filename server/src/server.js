// Load environment variables first
require("dotenv").config();

const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { verifyToken } = require("./middleware/auth");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const httpServer = http.createServer(app);

  // Setup Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:80", "http://localhost"],
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Apply middleware
  app.use(
    "/graphql",
    cors({
      origin: ["http://localhost:5173", "http://localhost:80", "http://localhost"],
      credentials: true,
    }),

    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        let user = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          try {
            const decoded = verifyToken(token);
            const dbUser = await User.findById(decoded.id).select("-password");
            if (dbUser) {
              user = {
                id: dbUser._id.toString(),
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
              };
            }
          } catch (err) {
            // Token invalid — user stays null (unauthenticated)
            console.warn("Invalid token:", err.message);
          }
        }
        return { user, io };
      },
    })
  );

  httpServer.listen(PORT, () =>
    console.log(`Server ready at http://localhost:${PORT}/graphql`)
  );
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
