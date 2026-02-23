const db = require('../../util/database');

class Pokedex {
    constructor(pokemon_name, pokemon_type_1, pokemon_type_2, hp, attack, defense, sp_atk, sp_def, pokemon_image, added_by_user) {
        this.pokemon_name = pokemon_name;
        this.pokemon_type_1 = pokemon_type_1;
        this.pokemon_type_2 = pokemon_type_2;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.sp_atk = sp_atk;
        this.sp_def = sp_def;
        this.pokemon_image = pokemon_image;
        this.added_by_user = added_by_user;
    }

    save() {
        return db.execute(
            'INSERT INTO pokedex (pokemon_name, pokemon_type_1, pokemon_type_2, hp, attack, defense, sp_atk, sp_def, pokemon_image, added_by_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [this.pokemon_name, this.pokemon_type_1, this.pokemon_type_2, this.hp, this.attack, this.defense, this.sp_atk, this.sp_def, this.pokemon_image, this.added_by_user]
        );
    }

    static getAll() {
        return db.execute('SELECT * FROM pokedex');
    }
}

module.exports = Pokedex;