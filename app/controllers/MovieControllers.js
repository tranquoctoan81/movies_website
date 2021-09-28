const { connect, connection } = require('../models/database'); //connect mysql
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
class MovieController {
    //GET /home1  page được render từ database
    home(req, res, next) {
        connect();
        connection.query('SELECT * FROM movie', function (err, movies, fields) {
            if (!err) {
                res.render('home1', { movies });
            } else {
                console.log(err);
            }
        });
    }

    //GET /home page chưa được đổ dữ liệu từ database
    before(req, res, next) {
        connect();
        connection.query('SELECT * FROM movie', function (err, movies, fields) {
            if (!err) {
                res.render('home', { movies });
            } else {
                console.log(err);
            }
        });
    }


    //[GET] /:slug
    watchMovie(req, res, next) {
        var slug = req.params.slug
        connect();
        connection.query("SELECT * FROM movie WHERE slug = ?", slug, function (err, data, fields) {
            if (!err) {
                res.render('movies/watchMovie', { data });
            } else {
                console.log(err);
            }
        });
    }

    //[GET] /create
    create(req, res) {
        res.render('movies/create')
    }

    //khi submit form create
    store(req, res) {
        res.send(123)
    }

    //[GET]  /json  gói json database
    json(req, res) {
        connect();
        connection.query('SELECT * FROM movie', function (err, resultQuery, fields) {
            if (!err) {
                res.json(resultQuery)
            } else {
                console.log(err);
            }
        });
    }


    //[GET] /register
    register(req, res) {
        res.render('validate/register')
    }

    //[GET] /login
    login(req, res) {
        res.render('validate/login')
    }


    //[POST] /profile
    profile(req, res) {
        // console.log(req.body)
        // const name = req.body.name  
        // const email = req.body.email  
        // const username = req.body.username  
        // const password = req.body.password
        const { name, email, username, password, passwordConfirm } = req.body
        connect();
        connection.query('SELECT email FROM users WHERE email = ?', [email], async function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            if (result.length > 0) {
                return res.render('validate/register', {
                    message: 'Email đó đã được sử dụng!'
                })
            } else if (password != passwordConfirm) {
                return res.render('validate/register', {
                    message: 'Mật khẩu không khớp!'
                })
            }
            let hashedPassword = await bcrypt.hash(password, 7)
            connection.query('INSERT INTO users SET ?', { name: name, email: email, username: username, password: hashedPassword }, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                    return res.render('validate/profile', {
                        message: 'Đăng ký thành công!'
                    })
                }
            })
        });
    }



    //[post]  /login
    loginHandle(req, res) {
        try {
            const { username, password, passwordConfirm } = req.body
            connect()
            connection.query('SELECT * FROM users WHERE username = ?', [username],
                (error, results, fields) => {
                    if (results) {
                        const hashPass = bcrypt.compareSync(req.body.password, results[0].password)
                        if (hashPass) {
                            console.log('successful')
                            res.redirect('/')
                        } else {
                            console.log('mk err')
                            return res.render('validate/login', {
                                message: 'Sai mật khẩu!!!!'
                            })
                        }
                    } else {
                        return res.render('validate/login', {
                            message: 'Tài khoản không tồn tại!!!!'
                        })
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }








    // loginHandle(req, res) {
    //     const { username, password, passwordConfirm } = req.body
    //     // const hash = bcrypt.hash(password, 7);
    //     // const bcryptPassword = bcrypt.compareSync(password, hash);
    //     if (username && bcryptPassword) {
    //         connect()
    //         connection.query('SELECT password FROM users WHERE username = ? AND password', [username, bcryptPassword],
    //             (error, results, fields) => {
    //                 if (results.length > 0) {
    //                     res.send("Successful");
    //                 } else {
    //                     res.send('Incorrect Email and/or Password!');
    //                 }
    //                 res.end();
    //             });
    //     } else {
    //         res.send('Please enter Username and Password!');
    //         res.end();
    //     }
    // }

    //[GET] /danh-sach/phim-de-cu
    listPdc(req, res) {
        connect();
        connection.query('SELECT * FROM movie', function (err, movies, fields) {
            if (!err) {
                res.render('movies/listPdc', { movies });
            } else {
                console.log(err);
            }
        });
    }
    listPmcn(req, res) {
        res.render('movies/listPmcn')
    }

}



module.exports = new MovieController();
