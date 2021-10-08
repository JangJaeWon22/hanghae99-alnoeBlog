const app = require("./app")
const connect =require("./models/index");
const PORT = process.env.PORT
connect();


app.listen(PORT, ()=>{
    console.log(`${PORT} 포트로 연결 되었습니다.`)
})