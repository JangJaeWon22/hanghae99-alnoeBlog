const mongoose = require('mongoose');

const { Schema } = mongoose;
//필요 정보 : 제목, 작성자, 작성날짜, 패스워드, 내용
    const commentSchema = new Schema({
        commentId: {
            type: Number,
            required:true,
            unique: true,
        },
        commentMain: {
            type: String,
            //이 값이 필수한 정보이냐
            required: true,
        },
        commentDate: {
            type: Date,
            //이 값이 필수한 정보이냐
            required: true,
        },
        commentUserNick: {
            type: String,
            required: true
        },
        borderDate: {
            type: Date,
            //이 값이 필수한 정보이냐
            required: true,
        },
        commentCorrectDate: {
            type: Date
        }
    });

    module.exports  = mongoose.model("Comment", commentSchema)