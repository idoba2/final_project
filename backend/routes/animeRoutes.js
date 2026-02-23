const express = require('express');
const animeController = require('../controllers/animeController');
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
    return res.status(401).send('You must be logged in to add Anime');
};

router.get('/Anime', (req, res, next) => {
    res.render('Anime', getSessionData(req));
});

router.get('/Season', (req, res, next) => {
    res.render('Season', getSessionData(req));
});

const animeUpload = createUploader('Anime_Images');

router.post('/addAnime', isAuthenticated, animeUpload.single('anime_image'), handleUploadErrors, animeController.saveAnime);
router.get('/anime_list', animeController.getAnimeList);
router.get('/api/anime', animeController.getAnimeListJson);

module.exports = router;