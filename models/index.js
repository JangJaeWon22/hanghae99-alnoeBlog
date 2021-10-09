const mongoose = require('mongoose')

const connect = () => {
    return mongoose
        .connect('mongodb://test:test@3.34.44.44:27017/test?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err) => console.log(err))
}

mongoose.connection.on('error', (err) => {
    console.error('몽고디비 연결 에러입니다.', err)
})

module.exports = connect

//mongodb://localhost:27017//test
//mongodb://아뒤:비번@주소:27017/test?authSource=admin
