import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const secretKey = "abcdefg1234%^&*";
const bcryptSaltRounds = 10;
const jwtExpiresInDays = "2d";
async function createJwtToken(id) {
  return jwt.sign({ id }, secretKey, { expiresIn: jwtExpiresInDays });
}
export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  // 회원 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다.` });
  }
  const hashed = bcrypt.hashSync(password, bcryptSaltRounds);
  const users = await authRepository.createUser(userid, hashed, name, email);
  const token = await createJwtToken(users.id);
  console.log(token);
  if (users) {
    res.status(201).json({ token, userid });
  }
}
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    res.status(401).json(`${userid} 아이디를 찾을 수 없음`);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "아이디 또는 비밀번호 확인" });
  }
  const token = await createJwtToken(user.id);
  res.status(200).json({ token, userid });
}
export async function verify(req, res, next) {
  const id = req.id;
  if (id) {
    res.status(200).json(id);
  } else {
    res.status(401).json({ message: "사용자 인증 실패" });
  }
}

// 로그인 정보 확인 (과제)
export async function me(req, res, next) {
  if (req.session.user) {
    const user = await authRepository.findByid(req.session.user.id);

    if (!user) {
      return res.status(404).json({ message: "일치하는 사용자가 없음" });
    }

    return res.status(200).json({
      token: req.session.user.token,
      userid: user.userid,
    });
  } else {
    return res.status(401).json({ message: "로그인이 필요합니다" });
  }
}

// 로그아웃 (과제)
export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "로그아웃 성공" });
  });
}
