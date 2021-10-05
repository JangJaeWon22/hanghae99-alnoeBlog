const express = require("express");
const Border = require("../models/border");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      email: user.email,
      nickname: user.nickname,
    },
  });
});

router.post("/borderWrite", async (req, res) => {
  //작성한 정보 가져옴
  const { borderDate, borderUserNick, borderPwd, borderTitle, borderContent } =
    req.body;
  //유효성 검사
  isExist = await Border.find({ borderDate });
  if (isExist.length == 0) {
    await Border.create({
      borderDate,
      borderUserNick,
      borderPwd,
      borderTitle,
      borderContent,
    });
  }
  res.send({ result: "success" });
});

router.get("/borderList", async (req, res) => {
  const borderList = await Border.find({}).sort("-borderDate");
  res.json({ borderList });
});

router.get("/borderList/:borderDate", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { borderDate } = req.params;
  const borderDetail = await Border.findOne({ borderDate });
  res.json({ borderDetail });
});

//글 수정 페이지 서버 구축
//수정할 페이지도 주소에 파라미터값으로 가져옴
router.patch("/borderList/:borderDate", async (req, res) => {
  const { borderDate } = req.params;
  const { borderUserNick, borderTitle, borderContent } = req.body;
  isBorder = await Border.find({ borderDate });
  if (isBorder.length) {
    await Border.updateOne(
      { borderDate },
      { $set: { borderUserNick, borderTitle, borderContent } }
    );
  }
  res.send({ result: "success" });
});

//삭제할 페이지도 주소에 파라미터값으로 가져옴
router.delete("/borderList/:borderDate", async (req, res) => {
  const { borderDate } = req.params;
  const isBorder = await Border.find({ borderDate });
  if (isBorder.length > 0) {
    await Border.deleteOne({ borderDate });
  }
  res.send({ result: "success" });
});

module.exports = router;
