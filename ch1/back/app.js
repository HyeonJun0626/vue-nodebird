const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // npm i bcrypt
const passport = require('passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan'); // npm i

const db = require('./models');
const passportConfig = require('./passport');
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const app = express();

// db.sequelize.sync({ force: true }); // 실행마다 테이블 재 생성
db.sequelize.sync();
passportConfig();

app.use(morgan('dev')) // 요청 정보를 콘솔에 보여줌
app.use(cors({
    origin: 'http://localhost:3080',
    credentials: true,
})); // npm i cors
app.use('/', express.static('uploads'));
app.use(express.json()); // body json 형식을 기본적으로 못 받아서 설정 해줘야 함
app.unsubscribe(express.urlencoded({ extended: false })); // form action으로 들어오는 데이터를 해석 (formData 아님)
app.use(cookie('cookiesecret')); // npm i cookie-parser
app.use(session({  // 패스포트 세션을 사용하려면 npm i express-session
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret', // 쿠키 해독용
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.status(200).send('안녕 백엔드');
})

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);



app.listen(3085, () => {
    console.log(`백엔드 서버 ${3085}번 포트에서 작동 중.`)
})