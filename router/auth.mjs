import express from "express";
import * as authController from "../controller/auth.mjs";
const router = express.Router();

//회원가입 (post)

router.post("/signup", authController.signup);

//로그아웃 (get)
router.get("/logout", logout);

//로그인 (post)
router.post("/login", authController.login);

//사용자 정보 확인 (get)
router.get("/me", me);

export default router;
