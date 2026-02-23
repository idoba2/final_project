const mysql=require('mysql2');
const pool = mysql.createPool({
 host:'localhost',
 user:'root',
 database:'pokemon_project',
 password:'asd123'
});
module.exports=pool.promise();
