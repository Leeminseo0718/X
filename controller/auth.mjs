import * as authRepository from "../data/auth.mjs";

// 회원가입
export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const users = await authRepository.createUser(userid, password, name, email);
  if (users) {
    res.status(201).json(users);
  } else {
    res.status(500).json({ message: "회원가입 실패" });
  }
}

// 로그인 + 세션 저장
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.login(userid, password);
  if (user) {
    req.session.user = { userid: user.userid, name: user.name };
    res.status(200).json({ message: `${userid}님 로그인 성공!`, user });
  } else {
    res
      .status(404)
      .json({ message: `${userid}님 아이디 또는 비밀번호를 확인하세요.` });
  }
}

// 로그인 정보 확인 (과제)
export function me(req, res, next) {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "로그인이 필요합니다" });
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
