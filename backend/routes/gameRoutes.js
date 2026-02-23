const express = require('express');
const gameController = require('../controllers/gameController');
const { createUploader, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

const getSessionData = (req) => {
    return {
        isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
        username: req.session && req.session.username ? req.session.username : null
    };
};

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    return res.status(401).send('You must be logged in to add Games');
};

router.get('/Games', (req, res, next) => {
    res.render('Games', getSessionData(req));
});

const gameUpload = createUploader('Games_Images');

router.post('/addGame', isAuthenticated, gameUpload.single('game_image'), handleUploadErrors, gameController.addGame);
router.get('/game_list', gameController.getGameList);
router.get('/api/games', gameController.getGameListJson);
router.get('/games/:id', gameController.getGameDetails);

module.exports = router;