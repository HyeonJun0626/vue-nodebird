const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser( (user, done) => { // 세션에는 사용자 id값만 저장, 서버에 모든 사용자의 정보를 다 저장하면 서버 무거움
        return done(null, user.id);
    });
    // 매 요청마다 받은 쿠키로 사용자 정보를 가져옴
    passport.deserializeUser( async (id, done) => {
        try {
            // 매 요청마다 실행되기 때문에 캐싱을 통해서 극복함, 캐싱 어떻게함?
            const user = await db.User.findOne({ 
                where: { id },
                attributes: ['id', 'nickname'],
                include: [{
                    model: db.Post,
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id'],
                }, {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id']
                }],
            });
            return done(null, user); // req.user에 상요자 정보를 담고, req.isAuthenticated() === true로 만들어줌
        } catch (err) {
            console.error(err);
            return done(err);
        }
    })
    local();
}