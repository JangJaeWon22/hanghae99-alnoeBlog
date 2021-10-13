const connect = require('../models/index')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')

const userIds = []
beforeAll(async () => {
    await connect()
    const user = await User.create({ id: 'people', password: '1234' })
    userIds.push(user._id)
})

describe('test for auth', () => {
    it('비밀번호에 아이디내용 포함', async () => {
        const res = await supertest(app).post('/api/users').send({
            id: '1234',
            password: '1234',
            confirmPassword: '1234',
        })
        expect(res.status).toBe(400)
        expect(res.text).toBe(
            '비밀번호 4자 이상이며 아이디를 포함하면 안됩니다.'
        )
    })

    it('아이디 중복', async () => {
        const res = await supertest(app).post('/api/users').send({
            id: 'people',
            password: '12345678',
            confirmPassword: '12345678',
        })
        expect(res.status).toBe(400)
        expect(res.text).toBe('이미 가입된 아이디가 있습니다.')
    })

    // it('아이디 양식 틀림(alphanum)', async () => {
    //     const res = await supertest(app).post('/api/users').send({
    //         id: '가나다라마',
    //         password: '12345678',
    //         confirmPassword: '12345678',
    //     });
    //     expect(res.status).toBe(400);
    //     expect(res.text).toBe('닉네임은 3자 이상이며 알파벳(대소문자), 숫자(0~9)를 포함해야됩니다.');
    // });

    // it('짧은 아이디', async () => {
    //     const res = await supertest(app).post('/api/users').send({
    //         id: 'a',
    //         password: '12345678',
    //         confirmPassword: '12345678',
    //     });
    //     expect(res.status).toBe(400);
    //     expect(res.text).toBe('닉네임은 3자 이상이며 알파벳(대소문자), 숫자(0~9)를 포함해야됩니다.');
    // });

    // it('비밀번호와 비밀번호 확인 불일치', async () => {
    //     const res = await supertest(app).post('/api/users').send({
    //         id: 'superman',
    //         password: 'asdfqwer',
    //         confirmPassword: '12345678',
    //     });
    //     expect(res.status).toBe(400);
    //     expect(res.text).toBe('패스워드가 패스워드 확인란과 일치하지 않습니다.');
    // });
})

afterAll(async () => {
    await User.deleteMany({ _id: userIds })
})
