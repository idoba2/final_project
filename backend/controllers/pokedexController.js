const Pokedex = require('../models/Pokedex');

// Creates new pokemon entry with image upload and user attribution
exports.addPokemon = (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('Pokemon image is required');
    }

    if (!req.session || !req.session.username) {
        return res.status(401).send('You must be logged in to add Pokemon');
    }

    const addedByUser = req.session.username;

    const newPokemon = new Pokedex(
        req.body.pokemon_name,
        req.body.pokemon_type_1,
        req.body.pokemon_type_2 || null,
        req.body.hp,
        req.body.attack,
        req.body.defense,
        req.body.sp_atk,
        req.body.sp_def,
        req.file.filename,
        addedByUser  // Pass session username
    );

    newPokemon.save()
        .then(() => {
            res.redirect('/Pokedex');
        })
        .catch((err) => {
            console.error('DB Error:', err);
            res.status(500).send('Database Error');
        });
};

exports.getPokemonList = (req, res, next) => {
    Pokedex.getAll()
        .then(([rows]) => {
            res.render('pokemon_list', { p_name: rows });
        })
        .catch((err) => {
            console.log(err);
            res.render('pokemon_list', { p_name: [] });
        });
};

exports.getPokemonListJson = (req, res, next) => {
    Pokedex.getAll()
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed to load pokemon list' });
        });
};