const db = require('../../util/database');
const crypto = require('crypto');

class User {
    constructor(username, password, birth_date, city, gender, occupation) {
        this.username = username;
        this.password = password;
        this.birth_date = birth_date;
        this.city = city;
        this.gender = gender;
        this.occupation = occupation;
    }

    // Saves new user with SHA-256 hashed password
    save() {
        const hashedPassword = crypto.createHash('sha256').update(this.password).digest('hex');

        return db.execute(
            'INSERT INTO users (username, password, birth_date, city, gender, occupation) VALUES (?, ?, ?, ?, ?, ?)',
            [this.username, hashedPassword, this.birth_date, this.city, this.gender, this.occupation]
        );
    }

    static findByUsername(username) {
        return db.execute('SELECT * FROM users WHERE username = ?', [username]);
    }

    // Returns user data excluding sensitive fields (password)
    static getPublicByUsername(username) {
        return db.execute(
            'SELECT username, birth_date, city, gender, occupation FROM users WHERE username = ?',
            [username]
        );
    }
}

module.exports = User;