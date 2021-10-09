const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const authMiddleware = require("../middlewares/auth-middleware");

//내정보 조회
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      userId: user.id,
    },
  });
});


//댓글 등록 API
router.post("/borderList/:borderDate/comment", authMiddleware, async (req, res) => {
  const commentUserNick = res.locals.user.id;
  const { borderDate } = req.params;
  iscommentId = await Comment.find({borderDate});
  commentId = iscommentId.length + 1;
  const { commentMain, commentDate } = req.body;
  await Comment.create({
    commentId,
    commentMain,
    commentDate,
    commentUserNick,
    borderDate,
  });
  res.send({ result: "success" });
});

//댓글 가져오기 API
router.get("/borderList/:borderDate/comment", authMiddleware, async (req, res) => {
    const userId = res.locals.user.id;
    const { borderDate } = req.params;
    const commentList = await Comment.find({ borderDate }).sort("-commentDate");
    res.json({ commentList, userId })
})

//댓글 수정 API
router.patch("/borderList/:borderDate/comment/:commentId", authMiddleware, async (req, res) => {
  const { borderDate , commentId } = req.params;
  const { commentMain, commentCorrectDate } = req.body;
  const isBorderDate = await Comment.find({
    $and : [{borderDate}, {commentId}]
    });
    if( commentMain == "" || commentMain == " "){
      res.status(400).send({
        errorMessage: "댓글의 내용을 입력해주세요.",
      });
    }
  if (isBorderDate.length > 0) {
    await Comment.updateOne(
      { commentId },
      { $set: { commentMain , commentCorrectDate } }
    );
  }
  res.send({ result: "success" });
});

//댓글 삭제 API
router.delete("/borderList/:borderDate/comment/:commentId", authMiddleware, async (req, res) => {
  const { borderDate , commentId } = req.params;
  const isBorderDate = await Comment.find({
    $and : [{borderDate}, {commentId}]
    });
    if(isBorderDate.length > 0){
      await Comment.deleteOne({ commentId })
    }
  res.send({ result: "success" });
});


module.exports = router;
