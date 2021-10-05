const app = require("./app")
PORT = 3000;

app.listen(PORT, ()=>{
    console.log(`${PORT} 포트로 연결 되었습니다.`)
})