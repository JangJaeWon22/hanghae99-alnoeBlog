"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");

// 회원가입
router.post("/users", async (req, res) => {
    const { id, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    const existUsers = await User.find({ id });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 아이디가 있습니다.",
      });
      return;
    }
    if(password.includes(id) || password.length < 4 ){
      res.status(400).send({
        errorMessage: "비밀번호 4자 이상이며 아이디를 포함하면 안됩니다.",
      });
      return;
    }
    if(!/[a-zA-Z0-9]+/.test(id) || id.length < 3){
      res.status(400).send({
        errorMessage: "닉네임은 3자 이상이며 알파벳(대소문자), 숫자(0~9)를 포함해야됩니다.",
      });
      return;
    }
    const user = new User({ id, password });
    await user.save();
    res.status(200).send({});
});


//joi 활용 로그인

router.post("/auth", async (req, res) => {

    const { id, password } = req.body;
    const user = await User.findOne({ id, password });

    if (!user) {
      res.status(401).send({
        errorMessage: "아이디와 비밀번호를 확인하세요.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
    res.send({
      token,
    });
});

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
      user:{
        userId: user.id,
      }
  });
});


module.exports = router;
