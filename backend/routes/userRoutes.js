const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/User');

const router = express.Router();

// Helper function to pass session variables to views
const getSessionData = (req) => {
    return {
        isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
        username: req.session && req.session.username ? req.session.username : null
    };
};

router.get('/', (req, res, next) => {
    res.render('Home_page', getSessionData(req));
});

router.get('/Add', (req, res, next) => {
    res.render('Add', getSessionData(req));
});

router.get('/PokeQuiz', (req, res, next) => {
    res.render('PokeQuiz', {
        ...getSessionData(req),
        phpSaveUrl: 'http://liadka2.mtacloud.co.il/poke_quiz.php'
    });
});

router.get('/Profile', (req, res, next) => {
    if (!req.session || !req.session.isLoggedIn) {
        return res.redirect('/Add');
    }
    
    User.getPublicByUsername(req.session.username)
        .then(([rows]) => {
            if (rows.length === 0) {
                return res.redirect('/Add');
            }
            
            const user = rows[0];
            res.render('Profile', {
                isLoggedIn: true,
                username: req.session.username,
                user: user
            });
        })
        .catch((err) => {
            console.error('Error loading profile:', err);
            res.status(500).send('Error loading profile');
        });
});

router.get('/auth/status', userController.authStatus);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

module.exports = router;