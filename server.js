const app = require("./app")
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`${PORT} 포트로 연결 되었습니다.`)
})