const express = require('express');
const mongoose = require("mongoose");
const app = express();
const userRouter = require("./routes/user")
const borderRouter = require("./routes/borders")

mongoose.connect("mongodb://localhost/blog-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

app.use("/api", express.urlencoded({ extended: false }) ,userRouter);
app.use("/api", express.urlencoded({ extended: false }) ,borderRouter);
// 프론트 js, ess 파일
app.use(express.static('public')); 

app.set("views", __dirname + "/views");
app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("borderlist")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

//borderList 페이지 이동
app.get('/borderList', (req, res) => {
    res.render('borderList');
})

//borderDetail 페이지 이동
app.get('/borderDetail', (req, res) => {
  res.render('borderDetail');
})

//borderWrite 페이지 이동
app.get('/borderWrite', (req, res) => {
  res.render('borderWrite');
})

//borderCorrect 페이지 이동
app.get('/borderCorrect', (req, res) => {
  res.render('borderCorrect');
})
module.exports = app;