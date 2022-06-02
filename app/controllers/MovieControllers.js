require('dotenv').config()
const { connect, connection } = require('../models/database'); //connect mysql
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendCustomEmail } = require('../../middleware/nodemailerServer')
let slugs
let random
let emailForget
let userIDHome
class MovieController {
    //GET /home1  page được render từ database
    home(req, res, next) {
        // userIDHome = req.userID
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
    // watchMovie(req, res, next) {
    //     var slug = req.params.slug
    //     connect()
    //     connection.query("SELECT movie.*, country.name as nation, GROUP_CONCAT(category.name) as cat from movie left join production_country on movie.movieID = production_country.movieID left join country on production_country.countryID = country.countryID left join movie_category ON movie.movieID = movie_category.movieID LEFT JOIN category ON category.categoryID = movie_category.categoryID WHERE movie.slug = ? ", slug, function (err, data, fields) {
    //         if (!err) {
    //             res.render('movies/watchMovie', { data });
    //         } else {
    //             console.log(err);
    //         }
    //     });
    // }



    watchMovie(req, res, next) {
        var slug = req.params.slug
        slugs = slug
        connect()
        connection.query("SELECT movie.*, country.name as nation, GROUP_CONCAT(DISTINCT category.name) as cat, GROUP_CONCAT(DISTINCT actors.name) as actor, COUNT(appreciate.movieID) AS reviews, AVG(appreciate.mark) AS mark from movie left join production_country on movie.movieID = production_country.movieID left join country on production_country.countryID = country.countryID left join movie_category ON movie.movieID = movie_category.movieID LEFT JOIN category ON category.categoryID = movie_category.categoryID LEFT JOIN movie_actors ON movie.movieID = movie_actors.movieID LEFT JOIN actors ON actors.actorsID = movie_actors.actorsID LEFT JOIN appreciate ON appreciate.movieID = movie.movieID WHERE movie.slug = ? GROUP BY appreciate.movieID", slug, function (err, data, fields) {
            if (!err) {
                let arr = { ...data }
                connection.query('Select COUNT(appreciate.usersID) AS reviews , AVG(appreciate.mark) AS mark from appreciate WHERE movieID = ?', arr[0].movieID, function (err, data1, fields) {
                    arr[0].reviews = data1[0].reviews;
                    arr[0].mark = (Math.round(arr[0].mark * 100) / 100)
                    res.render('movies/watchMovie', { arr });
                })
            } else {
                console.log(err);
            }
        });
    }

    jsonActors(req, res, next) {
        connect()
        connection.query("SELECT actors.* FROM actors JOIN movie_actors ON actors.actorsID = movie_actors.actorsID JOIN movie ON movie.movieID = movie_actors.movieID WHERE movie.slug = ? ", slugs, function (err, actor, fields) {
            res.json(actor);
        })
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

    jsonDesc(req, res) {
        connect();
        connection.query('SELECT * FROM movie ORDER BY create_date DESC', function (err, resultQuery, fields) {
            if (!err) {
                res.json(resultQuery)
            } else {
                console.log(err);
            }
        });
    }

    jsonCategory(req, res) {
        connect();
        connection.query('SELECT * FROM category ', function (err, data, fields) {
            if (!err) {
                res.json(data)
            } else {
                console.log(err);
            }
        });
    }

    jsonCountry(req, res) {
        connect();
        connection.query('SELECT name FROM country ', function (err, data, fields) {
            if (!err) {
                res.json(data)
            } else {
                console.log(err);
            }
        });
    }

    jsonMovieHot(req, res) {
        connect();
        connection.query('Select movie.*, COUNT(users_movie.movieID) AS lượt_xem from movie LEFT OUTER JOIN users_movie ON movie.movieID = users_movie.movieID GROUP BY movie.movieID ORDER BY lượt_xem DESC;', function (err, data, fields) {
            if (!err) {
                res.json(data)
            } else {
                console.log(err);
            }
        });
    }
    jsonRecommendedMovies(req, res) {
        connect();
        if (req.userID) {
            connection.query('SELECT appreciate.movieID, COUNT(appreciate.movieID) as TONGLUOTDANHGIA FROM appreciate WHERE appreciate.usersID = ? GROUP BY appreciate.movieID ORDER BY TONGLUOTDANHGIA DESC LIMIT 1', req.userID, function (err, data, fields) {
                if (!err) {
                    if (data.length > 0) {
                        connection.query('SELECT movie_category.categoryID as cate FROM movie_category LEFT JOIN category ON category.categoryID = movie_category.categoryID WHERE movie_category.movieID = ?', data[0].movieID, (err, data1, fields) => {
                            let idCate = []
                            data1.map(item => {
                                idCate.push(JSON.stringify(item.cate))
                            })
                            const newData = `(${idCate.toString()})`
                            connection.query(`SELECT movie.*, COUNT(users_movie.movieID) AS lượt_xem FROM movie LEFT JOIN movie_category ON movie_category.movieID = movie.movieID LEFT OUTER JOIN users_movie ON movie.movieID = users_movie.movieID WHERE movie_category.categoryID IN ${newData} GROUP BY movie.movieID`, (arr, movie) => {
                                res.json(movie)
                            })
                        })
                    } else {
                        connection.query('SELECT movie_category.categoryID as cate FROM movie_category LEFT JOIN category ON category.categoryID = movie_category.categoryID WHERE movie_category.movieID = 3', (err, data1, fields) => {
                            let idCate = []
                            data1.map(item => {
                                idCate.push(JSON.stringify(item.cate))
                            })
                            const newData = `(${idCate.toString()})`
                            connection.query(`SELECT movie.*, COUNT(users_movie.movieID) AS lượt_xem FROM movie LEFT JOIN movie_category ON movie_category.movieID = movie.movieID LEFT OUTER JOIN users_movie ON movie.movieID = users_movie.movieID WHERE movie_category.categoryID IN ${newData} GROUP BY movie.movieID`, (arr, movie) => {
                                res.json(movie)
                            })
                        })
                    }
                } else {
                    console.log(err);
                }
            });
        } else {
            res.json(123)
        }
    }


    //[GET] /register
    register(req, res) {
        res.render('validate/register')
    }

    //[GET] /login
    login(req, res) {
        res.render('validate/login')
    }

    //[GET] /logout
    logout(req, res) {
        res.clearCookie('token');
        res.clearCookie('name');
        res.redirect('/login');
    }


    //[POST] /register
    profile(req, res) {
        const { name, email, username, password, passwordConfirm } = req.body
        connect();
        connection.query('SELECT * FROM users WHERE email = ?', [email], async function (err, result, fields) {
            if (err) {
                console.log(err)
            }
            if (result.length > 0) {
                if (result[0].username == username) {
                    return res.render('validate/register', {
                        message: 'Tên tài khoản đã được sử dụng!'
                    })
                }
                if (result[0].email == email) {
                    return res.render('validate/register', {
                        message: 'Email đã được sử dụng!'
                    })
                }
            } else if (password != passwordConfirm) {
                return res.render('validate/register', {
                    message: 'Mật khẩu không khớp!'
                })
            }
            let hashedPassword = await bcrypt.hash(password, 10)
            connection.query('INSERT INTO users SET ?', { name: name, email: email, username: username, password: hashedPassword }, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    // alert('Đăng ký thành công')
                    return res.redirect('/login')
                }
            })
        });
    }



    //[post]  /login
    loginHandle(req, res) {
        connect();
        connection.query('SELECT * FROM users WHERE username = ?', req.body.username, (err, result) => {
            if (result.length === 0) {
                console.log('sai tài khoản');
                return res.render('validate/login', {
                    message: 'Sai tài khoản'
                })
            }
            bcrypt.compare(req.body.password, result[0].password, (err, bResult) => {
                const name = result[0].username;
                if (err) {
                    console.log('sai mk')
                    console.log(err);
                }
                if (bResult) {
                    const token = jwt.sign({ username: result[0].username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                    res.cookie('token', token, {
                        httpOnly: false,
                    })
                    res.cookie('name', name)
                    if (name === 'admin') {
                        return res.redirect('/admin')
                    } else {
                        return res.redirect('/')

                    }
                } else {
                    const user = req.body.username
                    return res.render('validate/login', {
                        message: 'Sai mật khẩu'
                    })
                }
            })
        })
    }



    //[GET] /danh-sach/phim-de-cu
    listPdc(req, res) {
        connect();
        connection.query('SELECT * FROM movie', function (err, movies, fields) {
            if (!err) {
                res.render('movies/list/Pdc', { movies });
            } else {
                console.log(err);
            }
        });
    }
    listPmcn(req, res) {
        res.render('movies/listPmcn')
    }

    //[GET] /search
    search(req, res) {
        const key = req.query.search_movie
        connect();
        connection.query("SELECT * FROM movie WHERE name = ?", key, function (err, data, fields) {
            if (err) {
                return res.json('Từ khóa không tồn tại!')
            } else {
                res.json(data)
            }
        });
    }

    searchCat(req, res) {
        let name
        Object.keys(req.params).forEach(function (key) {
            name = req.params[key]
        })
        connect();
        connection.query("SELECT movie.* FROM movie JOIN movie_category ON movie.movieID = movie_category.movieID JOIN category ON category.categoryID = movie_category.categoryID AND category.name = ?", name, function (err, movies, fields) {
            if (!err) {
                res.render('movies/list/categories', { movies, name });
            } else {
                console.log(err);
            }
        });
    }

    searchYear(req, res) {
        let year
        Object.keys(req.params).forEach(function (key) {
            year = req.params[key]
        })
        connect();
        connection.query("SELECT movie.* FROM movie WHERE movie.year = ?", year, function (err, movies, fields) {
            if (!err) {
                res.render('movies/list/year', { movies, year });
            } else {
                console.log(err);
            }
        });
    }

    searchCountry(req, res) {
        let country = req.params
        Object.keys(country).forEach(function (key) {
            country = country[key]
        })
        connect();
        connection.query("SELECT movie.*, country.name as nation FROM movie JOIN production_country ON movie.movieID = production_country.movieID JOIN country ON country.countryID = production_country.countryID WHERE country.name = ? GROUP BY movie.name", country, function (err, movies, fields) {
            if (!err) {
                res.render('movies/list/country', { movies, country });
            } else {
                console.log(err);
            }
        });
    }

    async userUpdateInfo(req, res) {
        let username = req.params;
        Object.keys(username).forEach(function (key) {
            username = username[key]
        })
        connect();
        connection.query("SELECT * FROM users WHERE username = ? GROUP BY users.name", username, await function (err, username, fields) {
            if (!err) {
                res.render('movies/updateUser', { username });
            } else {
                console.log(err);
            }
        });
    }

    async userUpdateHandle(req, res) {
        const { name, email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        connect();
        connection.query(`UPDATE users SET name = ?, email = ?, username = ?, password = ? WHERE users.username = ?`, [name, email, username, hashedPassword, username], (err, data) => {
            if (err) console.log(err)
            return res.redirect('/')
        })
    }

    forgotPassword(req, res, next) {
        res.render('validate/forgot_password')
    }
    forgotPasswordSecret(req, res) {
        emailForget = req.body.email
        connect();
        connection.query("SELECT users.* FROM users WHERE users.email =?", emailForget, (err, result) => {
            if (result.length > 0) {
                random = Math.floor(Math.random() * 1000000)
                sendCustomEmail(emailForget, "Khôi phục tài khoản", `Mã bí mật sẽ hết hạn sau 15 phút: ${random}`)
                res.render('validate/forgot_password_secret', { emailForget })
            } else {
                return res.render('validate/forgot_password', {
                    message: 'Email này chưa đăng ký tài khoản'
                })
            }
        })
    }
    forgotPasswordLassStep(req, res) {
        const secret = req.body.secret;
        if (secret == random) {
            res.render('validate/change_password')
        } else {
            res.json('khong trung')
        }
    }

    async changePassword(req, res) {
        const { password, confirm_password } = req.body
        if (password === confirm_password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            connect();
            connection.query(`UPDATE users SET password = ? WHERE users.email = ?`, [hashedPassword, emailForget], (err) => {
                if (err) console.log(err)
                return res.redirect('/login')
            })
        } else {
            return res.render('validate/change_password', {
                message: 'Email này chưa đăng ký tài khoản'
            })
        }
    }

    appreciate(req, res) {
        connect();
        connection.query("INSERT INTO appreciate SET ?", { movieID: req.body.movieID, usersID: req.userID, mark: req.body.mark }, (err, result) => {
            if (err) console.log(err)
            res.redirect('back')
        })
    }

}



module.exports = new MovieController();
