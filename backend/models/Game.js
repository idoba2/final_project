const db = require('../../util/database');

class Game {
    constructor(game_name, release_date, minimum_age, price, duration, platform, genre, game_description, game_image, added_by_user) {
        this.game_name = game_name;
        this.release_date = release_date;
        this.minimum_age = minimum_age;
        this.price = price;
        this.duration = duration;
        this.platform = platform;
        this.genre = genre;
        this.game_description = game_description;
        this.game_image = game_image;
        this.added_by_user = added_by_user;
    }

    save() {
        return db.execute(
            'INSERT INTO games (game_name, release_date, minimum_age, price, duration, platform, genre, game_description, game_image, added_by_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.game_name, this.release_date, this.minimum_age, this.price, this.duration, this.platform, this.genre, this.game_description, this.game_image, this.added_by_user]
        );
    }

    static getAll() {
        return db.execute('SELECT * FROM games');
    }

    static getById(id) {
        return db.execute('SELECT * FROM games WHERE id = ?', [id]);
    }
}

module.exports = Game;