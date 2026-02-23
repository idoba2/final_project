const db = require('../../util/database');

class Anime {
    constructor(season_name, seasons, episodes, start_date, end_date, anime_title, anime_description, anime_image, added_by_user) {
        this.season_name = season_name;
        this.seasons = seasons;
        this.episodes = episodes;
        this.start_date = start_date;
        this.end_date = end_date;
        this.anime_title = anime_title;
        this.anime_description = anime_description;
        this.anime_image = anime_image;
        this.added_by_user = added_by_user;
    }

    save() {
        return db.execute(
            'INSERT INTO anime (season_name, seasons, episodes, start_date, end_date, anime_title, anime_description, anime_image, added_by_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.season_name, this.seasons, this.episodes, this.start_date, this.end_date, this.anime_title, this.anime_description, this.anime_image, this.added_by_user]
        );
    }

    static getAll() {
        return db.execute('SELECT * FROM anime');
    }
}

module.exports = Anime;