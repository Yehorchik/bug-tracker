import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import session from "express-session";
import connectMongo from "connect-mongodb-session";

import "colors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";

import resolvers from "./graphql/resolvers/index.js";
import typeDefs from "./graphql/typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import passport from "passport";
import restRoutes from "./api/routes/index.js";
import "./configs/passport.js";

// add env variables to node instance
dotenv.config();
// Initialize Express App
const app = express();

// initialize MongoDB session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  databaseName: process.env.MONGO_DB_NAME,
  collection: "sessions",
});

// Configure CORS and body parsing middleware before any routes are handled
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Configure session with secure cookie settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
    store,
  })
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// REST API routes
app.use("/api", restRoutes);

// Create HTTP server for Express and Apollo Server
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req }) => ({
    req,
    user: req.user, // Passport populates this after successful login
    session: req.session, // Session data from express-session
  }),
});

// Start Apollo Server
await server.start();

// Use the Apollo server as middleware in your Express app
app.use("/graphql", expressMiddleware(server));

// Error handling middleware
app.use((err, _, res, __) => {
  console.error(err.stack);
  res.status(500).send("Something broke!".red.underline.bold);
});

// Connect to MongoDB and start the server
await connectDB();
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`.green.underline.bold);
