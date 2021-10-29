const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'movie_website',
});

function connect() {
    connection.connect(function (err) {
        if (!err) {
            console.log('Database is connected!!');
        }
        //  else {
        //     console.log('Database connect error!');
        // }
    });
};

const closeDB = function () {
    connection.end(function (err) {
        if (!err) {
            console.log('closed db');
        }
    });
};

// getAllUser = function (callbackQuery) {
//     connect();
//     connection.query('SELECT * FROM film', function (err, result, fields) {
//         if (!err) {
//             callbackQuery(result);
//         } else {
//             console.log(err);
//         }
//     });
// };
// getId = function (callbackQuery) {
//     connect();
//     connection.query('SELECT id FROM film ', function (err, result, fields) {
//         if (!err) {
//             callbackQuery(result);
//         } else {
//             console.log(err);
//         }
//     });
// };
// getUser = function (slug, callbackQuery) {
//     connect();
//     connection.query('"SELECT * FROM film WHERE" slug =' + slug + ' "', function (err, result, fields) {
//         if (!err) {
//             callbackQuery(result);
//         } else {
//             console.log(err);
//         }
//     });
// };
// getMovieItem = function (callbackQuery) {
//     connect();
//     connection.query('SELECT * FROM film ', function (err, result, fields) {
//         if (!err) {
//             callbackQuery(result);
//         } else {
//             console.log(err);
//         }
//     });
// };
module.exports = {
    // getAllUser,
    // getUser,
    // getId,
    connect,
    connection
}
