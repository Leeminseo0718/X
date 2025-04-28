import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import postRouter from "./router/posts.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";

const app = express();

// ES 모듈용 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON 바디 파싱
app.use(express.json());

// public 폴더 정적 제공
app.use(express.static(path.join(__dirname, "public")));

// API 라우터
app.use("/posts", postRouter);
app.use("/auth", authRouter);

// HTML 라우팅
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 404 처리
app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(config.host.port, () => {
  console.log(`Server is running on http://127.0.0.1:${config.host.port}`);
});
