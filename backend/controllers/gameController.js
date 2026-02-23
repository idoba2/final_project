const Game = require('../models/Game');

// Creates new game entry with release date validation
exports.addGame = (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('Game image is required');
    }

    if (!req.session || !req.session.username) {
        return res.status(401).send('You must be logged in to add Games');
    }

    const addedByUser = req.session.username;

    // Business rules: release date between 1996 and 5 years from now
    const releaseDate = new Date(req.body.release_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const fiveYearsFromNow = new Date();
    fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);

    if (releaseDate > fiveYearsFromNow) {
        return res.status(400).send('Release date cannot be more than 5 years in the future');
    }

    const firstPokemonGame = new Date('1996-01-01');
    if (releaseDate < firstPokemonGame) {
        return res.status(400).send('Release date cannot be before 1996');
    }

    const newGame = new Game(
        req.body.game_name,
        req.body.release_date,
        req.body.minimum_age,
        req.body.price,
        req.body.duration,
        req.body.platform,
        req.body.genre,
        req.body.game_description,
        req.file.filename,
        addedByUser
    );

    newGame.save()
        .then(() => {
            res.redirect('/Games');
        })
        .catch((err) => {
            console.error('DB Error:', err);
            res.status(500).send('Database Error');
        });
};

exports.getGameList = (req, res, next) => {
    Game.getAll()
        .then(([rows]) => {
            res.render('game_list', { g_name: rows });
        })
        .catch((err) => {
            console.log(err);
            res.render('game_list', { g_name: [] });
        });
};

exports.getGameListJson = (req, res, next) => {
    Game.getAll()
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed to load game list' });
        });
};

exports.getGameDetails = (req, res, next) => {
    const gameId = req.params.id;
    
    Game.getById(gameId)
        .then(([rows]) => {
            res.render('GameDetails', {
                isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
                username: req.session && req.session.username ? req.session.username : null
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).render('Page_not_found', {
                isLoggedIn: req.session && req.session.isLoggedIn ? true : false,
                username: req.session && req.session.username ? req.session.username : null
            });
        });
};