const express = require('express')
const mongoose = require('mongoose')
const app = express()
const userRouter = require('./routes/user')
const borderRouter = require('./routes/borders')
const commnetRouter = require('./routes/comment')
// 어떤 os에서 사용하더라도 환경변수를 설정하고 사용할 수 있다!
const dotenv = require('dotenv')
dotenv.config()

//각 기능에 맞는 맞는 api 연결
app.use('/api', express.urlencoded({ extended: false }), userRouter)
app.use('/api', express.urlencoded({ extended: false }), borderRouter)
app.use('/api', express.urlencoded({ extended: false }), commnetRouter)
// 프론트 js, ess 파일
app.use(express.static('public'))

//view 엔진
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

//렌더링
//메인페이지(전체 게시글) 이동
app.get('/', (req, res) => {
    res.render('borderList')
})

//로그인 페이지 이동
app.get('/login', (req, res) => {
    res.render('login')
})

//회원가입 페이지 이동
app.get('/register', (req, res) => {
    res.render('register')
})

//게시판 페이지 이동
app.get('/borderList', (req, res) => {
    res.render('borderList')
})

//게시글 상세 페이지 이동
app.get('/borderDetail', (req, res) => {
    res.render('borderDetail')
})

//게시글 작성 페이지 이동
app.get('/borderWrite', (req, res) => {
    res.render('borderWrite')
})

//게시글 수정 페이지 이동
app.get('/borderCorrect', (req, res) => {
    res.render('borderCorrect')
})
module.exports = app
