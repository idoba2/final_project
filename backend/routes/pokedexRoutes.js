const express = require('express');
const pokedexController = require('../controllers/pokedexController');
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
    return res.status(401).send('You must be logged in to add Pokemon');
};

router.get('/Pokedex', (req, res, next) => {
    res.render('Pokedex', getSessionData(req));
});

const pokemonUpload = createUploader('Pokedex_Images');

router.post('/addPokemon', isAuthenticated, pokemonUpload.single('pokemon_image'), handleUploadErrors, pokedexController.addPokemon);
router.get('/pokemon_list', pokedexController.getPokemonList);
router.get('/api/pokemon', pokedexController.getPokemonListJson);

module.exports = router;