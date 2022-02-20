const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isNotLoggedIn, isLoggedIn } = require('./middlewares');
const router = express.Router();


router.get('/', isLoggedIn, async (req, res, next) => {
    const user = req.user;
    return res.json(user);
})

router.get('/:id', async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followers',
                attributes: ['id'],
            }],
            attributes: ['id', 'nickname'],
        })
        res.json(user);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const exUser = await db.User.findOne({
            where: {
                email: req.body.email,
            }
        })

        if (exUser) {
            return res.status(403).json({
                errorCode: 1,
                message: '이미 가입된 email입니다.'
            })
        }
        await db.User.create({
            email: req.body.email,
            password: hash,
            nickname: req.body.nickname
        })
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            if (info) {
                return res.status(401).send(info.reason);
            }
            return req.login(user, async (err) => {
                if (err) {
                    console.error(err);
                    return next(err);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    attributes: ['id', 'email', 'nickname'],
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
                        attributes: ['id'],
                    }]
                })
                return res.json(fullUser);
            });
        })(req, res, next);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: '요청에 실패했습니다.'
        })
    }
});

router.post('/login', (req, res, next) => {
    // LocalStrategy에서 done(에러, 성공, 실패) 로 넘어 오는 값 err, user, info로 받음
    passport.authenticate('local', (err, user, info) => { 
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        // req.login은 app.use(passport.initialize()) 미들웨어에서 넣어주는 것, 로그인,로그아웃이 들어감
        // req.login에서 세션에 사용자 정보를 저장( 어떻게 저장하나 ? passport index에 serializeUser가)
        // req.login의 user는 index serializeUser로 넘어감
        return req.login(user, async (err) => { 
            if (err) {
                console.error(err);
                return next(err);
            }
            const fullUser = await db.User.findOne({
                where: { id: user.id },
                attributes: ['id', 'email', 'nickname'],
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
                    attributes: ['id'],
                }]
            })
            return res.json(fullUser); // 프론트로 넘겨주기, 쿠키는 req.login이 알아서 헤더에 넣어서 보내줌
        });
    })(req, res, next);
})

router.post('/logout', isLoggedIn, (req, res) => {
    // deserializeUser를 통해서 req에 담아진 req.user, req.isAuthenticated()=true를 활용할 수 있다.
    if (req.isAuthenticated()) {
        req.logout(); 
        req.session.destroy(); // 선택사항
        return res.status(200).send('로그아웃 되었습니다.');
    }
})

router.get('/:id/posts', async (req, res, next) => {
    let where = {
            UserId: parseInt(req.params.id, 10),
            RetweetId: null,
    };
    if (parseInt(req.query.lastId, 10)) {
        where[db.Sequelize.Op.lt] = parseInt(req.query.lastId, 10);
    }
    try {
        const posts = await db.Post.findAll({
            where,
            includ: [{
                model: db.User,
                attributes: ['id', 'nickname'],
            }, {
                model: db.Image,
            }, {
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        res.json(posts);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: {
                id: req.user.id
            }
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id)
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    const me = await db.User.findOne({
        where: {
            id: req.user.id
        }
    });
    await me.removeFollowing(req.params.id);
    res.send(req.params.id)
})

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: {
                id: req.user.id
            }
        });
        res.send(req.body.nickname);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id },
        });
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10),
        });
        res.json(followings);
    } catch (err) {
        console.error(err);
        next(err);
    }
})
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id },
        });
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
            limit: parseInt(req.query.limit || 3, 10),
            offset: parseInt(req.query.offset || 0, 10),
        });
        res.json(followers);
    } catch (err) {
        console.error(err);
        next(err);
    }
})

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: {
                id: req.user.id
            }
        });
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    } catch (err) {
        console.error(err);
        next(err);
    }
})
module.exports = router;