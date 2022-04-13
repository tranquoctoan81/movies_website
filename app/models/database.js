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

module.exports = {
    // getAllUser,
    // getUser,
    // getId,
    connect,
    connection
}
