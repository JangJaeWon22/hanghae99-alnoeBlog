const express = require('express')
const Border = require('../models/border')
const Comment = require('../models/comment')
const router = express.Router()
const authMiddleware = require('../middlewares/auth-middleware')

//내 정보 조회 API
router.get('/users/me', authMiddleware, async (req, res) => {
    const { user } = res.locals
    res.send({
        user: {
            userId: user.id,
        },
    })
})

//게시글 작성 API and 사용자 인증미들웨어 통과
router.post('/borderList', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    //작성한 정보 가져옴
    const {
        borderDate,
        borderUserNick,
        borderPwd,
        borderTitle,
        borderContent,
    } = req.body

    //유효성 검사
    isExist = await Border.find({ borderDate })
    if (isExist.length == 0) {
        await Border.create({
            borderDate,
            borderUserNick,
            borderPwd,
            borderTitle,
            borderContent,
        })
    }
    res.send({ result: 'success' })
})

//게시글 목록 조회 API
router.get('/borderList', async (req, res) => {
    const borderList = await Border.find({}).sort('-borderDate')
    res.json({ borderList })
})

//상세페이지 API 게시글 조회 -> 쿼리스트링 활용
router.get('/borderList/:borderDate', async (req, res) => {
    const { borderDate } = req.params
    const borderDetail = await Border.findOne({ borderDate })
    res.json({ borderDetail })
})

//게시글 수정 API-> 쿼리스트링 활용
router.patch('/borderList/:borderDate', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    const { borderDate } = req.params
    const { borderUserNick, borderTitle, borderContent } = req.body
    isBorder = await Border.find({ borderDate })
    if (isBorder.length) {
        await Border.updateOne(
            { borderDate },
            { $set: { borderUserNick, borderTitle, borderContent } }
        )
    }
    res.send({ result: 'success' })
})

//게시글 삭제 API -> 쿼리스트링 활용
router.delete('/borderList/:borderDate', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user
    const { borderDate } = req.params
    const isBorder = await Border.find({ borderDate })
    const isComment = await Comment.find({ borderDate })
    if (isBorder.length > 0) {
        await Border.deleteOne({ borderDate })
    }
    if (isComment.length > 0) {
        await Comment.deleteMany({ borderDate })
    }
    res.send({ result: 'success' })
})

module.exports = router
