"use strict";
const express = require("express");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middlewares/auth-middleware");


//joi 활용 회원가입
const postUsersSchema = Joi.object({
  id: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(4).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: Joi.ref("password"),
});

router.post("/users", async (req, res) => {
  try {
    const { id, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);
    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 일치하지 않습니다.",
      });
      return;
    }
    const existUsers = await User.find({ id });
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: "이미 가입된 이메일 또는 닉네임이 있습니다.",
      });
      return;
    }
    if(password.includes(id)){
      res.status(400).send({
        errorMessage: "비밀번호는 아이디의 내용을 포함 할 수 없습니다.",
      });
      return;
    }
    const user = new User({ id, password });
    await user.save();
    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: " 요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});


//joi 활용 로그인
const postAuthSchema = Joi.object({
  id: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(4).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

router.post("/auth", async (req, res) => {
  try {
    const { id, password } = await postAuthSchema.validateAsync(req.body);
    const user = await User.findOne({ id, password });

    if (!user) {
      res.status(401).send({
        errorMessage: "아이디와 비밀번호를 확인하세요.",
      });
      return;
    }
    const token = jwt.sign({ userId: user.userId }, "secret-key");
    res.send({
      token,
    });
  } catch (err) {
    res.status(400).send({
      errorMessage: " 요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
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
