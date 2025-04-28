import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";

const secretKey = config.jwt.secretKey;
const bcrtptSaltRounds = config.bcrtpt.secretKey;
const jwtExpiresInDays = config.jwt.expiresInSec;

export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const users = await authRepository.createUser(userid, password, name, email);
  if (users) {
    res.status(201).json(users);
  } else {
    res.status(500).json({ message: "회원가입 실패" });
  }
}

export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.login(userid, password);
  if (user) {
    res.status(200).json({ message: `${userid}님 로그인 성공!`, user });
  } else {
    res
      .status(404)
      .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요.` });
  }
}
