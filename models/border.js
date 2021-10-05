const mongoose = require('mongoose');

const { Schema } = mongoose;
//필요 정보 : 제목, 작성자, 작성날짜, 패스워드, 내용
    const borderSchema = new Schema({
        borderDate: {
            type: Date,
            //이 값이 필수한 정보이냐
            required: true,
            //이 값이 중복이 있으면 안되냐?
            unique: true
        },
        borderTitle: {
            type: String,
            required: true
        },
        borderUserNick: {
            type: String,
            required: true
        },
        borderPwd : {
            type: String,
            required: true
        },
        borderContent: {
            type: String
        }
    });

    module.exports  = mongoose.model("Border", borderSchema)