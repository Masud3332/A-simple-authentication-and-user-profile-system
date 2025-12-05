import express from "express";
import { dbConnect } from "./src/config/db.js";
import { authRoutes } from "./src/routes/auth.routes.js";
import { profileRoutes } from "./src/routes/profile.routes.js";
import dotenv from "dotenv";
dotenv.config();



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

authRoutes(app);
profileRoutes(app);

const startServer = () => {
  app.listen(process.env.PORT || 8080, () => {
    console.log(
      `🚀 Server running at http://localhost:${process.env.PORT || 8080}`
    );
  });
};

dbConnect(startServer);
