const Anime = require('../models/Anime');

// Creates new anime season with date validation
exports.saveAnime = (req, res, next) => {
    if (!req.file) {
        return res.status(400).send('Anime image is required');
    }

    if (!req.session || !req.session.username) {
        return res.status(401).send('You must be logged in to add Anime');
    }

    const addedByUser = req.session.username;

    // Business rules: end date after start date, max 10 years in future
    const startDate = new Date(req.body.start_date);
    const endDate = new Date(req.body.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate < startDate) {
        return res.status(400).send('End date cannot be earlier than start date');
    }

    const tenYearsFromNow = new Date();
    tenYearsFromNow.setFullYear(tenYearsFromNow.getFullYear() + 10);
    if (startDate > tenYearsFromNow || endDate > tenYearsFromNow) {
        return res.status(400).send('Dates cannot be more than 10 years in the future');
    }

    const newAnime = new Anime(
        req.body.season_name,
        req.body.seasons,
        req.body.episodes,
        req.body.start_date,
        req.body.end_date,
        req.body.anime_title,
        req.body.anime_description,
        req.file.filename,
        addedByUser
    );

    newAnime.save()
        .then(() => {
            res.redirect('/Anime');
        })
        .catch((err) => {
            console.error('DB Error:', err);
            res.status(500).send('Database Error');
        });
};

exports.getAnimeList = (req, res, next) => {
    Anime.getAll()
        .then(([rows]) => {
            res.render('anime_list', { a_name: rows });
        })
        .catch((err) => {
            console.log(err);
            res.render('anime_list', { a_name: [] });
        });
};

exports.getAnimeListJson = (req, res, next) => {
    Anime.getAll()
        .then(([rows]) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed to load anime list' });
        });
};