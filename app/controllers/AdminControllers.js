const { connect, connection } = require('../models/database'); //connect mysql
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
class adminController {
    //GET admin/home1  page được render từ database
    home(req, res, next) {
        connect();
        connection.query('SELECT * FROM users', function (err, users, fields) {
            if (!err) {
                res.render('admin/home', { users });
            } else {
                console.log(err);
            }
        });
    }

    movieManager(req, res) {
        connect();
        connection.query('SELECT * FROM movie', function (err, movie, fields) {
            if (!err) {
                res.render('admin/movie', { movie });
            } else {
                console.log(err);
            }
        });
    }


    userManager(req, res) {
        connect();
        connection.query('SELECT * FROM users', function (err, users, fields) {
            if (!err) {
                res.render('admin/users', { users });
            } else {
                console.log(err);
            }
        });
    }

    delete(req, res, next) {
        const id = req.params.id
        connect();
        connection.query("DELETE FROM users WHERE id = ?", id, function (err, data, fields) {
            if (!err) {
                res.redirect('back')
            } else {
                console.log(err);
            }
        });
    }

    //[DELETE] /admin/handle-form-action
    handleFormAction(req, res) {
        var numbers = req.body.userIds
        const userId = Object.values(numbers);
        // var selectedUser = userId.filter(value => true)
        // console.log(selectedUser)
        switch (req.body.action) {
            case 'delete':
                connect();
                connection.query("DELETE FROM users WHERE id IN (?)", [userId], function (err, data, fields) {
                    if (!err) {
                        res.redirect('back')
                    } else {
                        console.log(err);
                    }
                });
                break;
            default:
                res.json({ message: 'Hành động không hợp lê!!' })
        }
    }
}



module.exports = new adminController();
