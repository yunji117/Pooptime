// server/server.js
// const express = require('express');
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import quiz from "./routes/quiz.js";
import register from "./routes/register.js";
import commonsense from "./routes/commonsense.js";
import horror from "./routes/horror.js";
import community from "./routes/community.js";
import login from "./routes/Login.js";
import email from "./routes/email.js";
import comment from "./routes/comment.js";
import check from "./routes/authRoutes.js";
import support from "./routes/support.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';


//세션
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = YAML.load(join(__dirname, 'swagger/swagger_final.yaml'));



const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3030"], // 나의 프론트 주소
    credentials: true, // 세션 쿠키 허용할 경우 꼭 필요
  })
);
dotenv.config();

//세션 미들웨어
app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", check);
app.use("/quiz", quiz);
app.use("/register", register);
app.use("/knowledge", commonsense);
app.use("/horror", horror);
app.use("/community", community);
app.use("/login", login);
app.use("/comment", comment);
app.use("/email", email);
app.use("/support", support);

const PORT = process.env.SERVERPORT;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:8080");
});
