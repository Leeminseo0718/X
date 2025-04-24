import express from "express";
import * as authController from "../controller/auth.mjs";
const router = express.Router();

//회원가입
//GET
router.post("/signup", authController.signup);

//로그인
//GET

router.post("/login", authController.login);
//로그인 유지
//PUT

export default router;
