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
        connection.query('SELECT movie.*, GROUP_CONCAT(category.name) AS cat FROM movie LEFT JOIN movie_category ON movie.movieID = movie_category.movieID LEFT JOIN category ON category.categoryID = movie_category.categoryID GROUP BY movie.name', function (err, movie, fields) {
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
        let id = req.params
        Object.keys(id).forEach(function (key) {
            id = id[key]
        })
        connect();
        connection.query('DELETE FROM users_movie WHERE usersID = ?', id, (err) => {
            if (!err) {
                connection.query("DELETE FROM users WHERE usersID = ?", id, function (err, data, fields) {
                    if (!err) {
                        res.redirect('back')
                        console.log('xoa thanh cong')
                    } else {
                        console.log(err);
                    }
                });
            }
            else {
                console.log('xoa khong thanh cong')
            }
        })
    }

    deleteMovie(req, res, next) {
        const id = req.params.id
        connect();
        connection.query("DELETE FROM movie WHERE id = ?", id, function (err, data, fields) {
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
        console.log(numbers);
        // var selectedUser = userId.filter(value => true)
        // console.log(selectedUser)
        switch (req.body.action) {
            case 'delete':
                connect();
                connection.query("DELETE FROM users WHERE usersID IN (?)", [userId], function (err, data, fields) {
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

    //[DELETE] /admin/handle-form-action/movie
    handleFormActionMovie(req, res) {
        var numbers = req.body.movieIds
        const movieId = Object.values(numbers);
        switch (req.body.action) {
            case 'delete':
                connect();
                connection.query("DELETE FROM movie WHERE id IN (?)", [movieId], function (err, data, fields) {
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


    //[GET] /admin/:slug/update
    update(req, res) {
        const slug = req.params.slug;
        connect();
        connection.query('SELECT * FROM movie WHERE slug = ?', slug, (err, data) => {
            if (err) console.log(err)
            res.render('admin/update', { data })
        })
    }


    //[PUT] //admin/:slug/update
    updateHandleForm(req, res, next) {
        const { name, description, movie, year, image, trailer, slug } = req.body
        connect();
        connection.query(`UPDATE movie SET name=?, description=?, linkImage=?, linkVideo=?,year=?, idTrailer=?, slug=? WHERE slug = ?`, [
            name, description, image, movie, year, trailer, slug, slug
        ], (err, data) => {
            if (err) console.log(err)
            return res.redirect('/admin/movie-manager/')
        })
    }

    //[GET] /admin/movie-manager/create
    create(req, res) {
        res.render('admin/create')
    }
    addActor(req, res) {
        connect();
        connection.query('SELECT * FROM movie ORDER BY create_date DESC', (err, data) => {
            if (err) console.log(err);
            connection.query("SELECT * FROM actors ORDER BY create_date DESC", (err, actor) => {
                if (err) console.log(err)
                res.render('admin/actor', { data, actor });
            })
        })
    }

    //[POST] /admin/handle-form-action/create
    createMovie(req, res) {
        const { name, description, movie, year, image, trailer, slug } = req.body
        connect();
        connection.query(`INSERT INTO movie SET ?`, { name: name, description: description, linkImage: image, linkVideo: movie, year: year, idTrailer: trailer, slug: slug }, (err, data) => {
            if (err) console.log(err)
            return res.redirect('/admin/movie-manager')
        })
    }

    addNewActor(req, res, next) {
        const { name, actorCountry, image, story } = req.body
        connect()
        connection.query('INSERT INTO actors set ?', { name: name, actorCountry: actorCountry, image: image, story: story }, (err, data) => {
            if (err) console.log(err)
            return res.redirect('back')
        })
    }

    addActorForMovie(req, res) {
        const { movie, actor } = req.params
        connect()
        connection.query('INSERT INTO movie_actors set ?', { movieID: movie, actorsID: actor }, (err, data) => {
            if (err) return console.log(err)
            res.redirect('back')
        })
    }

    addCat(req, res) {
        connect();
        connection.query('SELECT * FROM movie ORDER BY create_date DESC', (err, data) => {
            if (err) console.log(err);
            connection.query("SELECT * FROM category ORDER BY create_date DESC", (err, cat) => {
                if (err) console.log(err)
                res.render('admin/cat', { data, cat });
            })
        })
    }

    addNewCat(req, res, next) {
        const { name } = req.body
        connect()
        connection.query('INSERT INTO category set ?', { name: name }, (err, data) => {
            if (err) console.log(err)
            return res.redirect('back')
        })
    }

    addCatForMovie(req, res) {
        const { movie, actor } = req.params
        connect()
        connection.query('INSERT INTO movie_category set ?', { movieID: movie, categoryID: actor }, (err, data) => {
            if (err) return console.log(err)
            res.redirect('back')
        })
    }

    addCountry(req, res) {
        connect();
        connection.query('SELECT * FROM movie ORDER BY create_date DESC', (err, data) => {
            if (err) console.log(err);
            connection.query("SELECT * FROM country ORDER BY create_date DESC", (err, country) => {
                if (err) console.log(err)
                res.render('admin/country', { data, country });
            })
        })
    }

    addNewCountry(req, res, next) {
        const { name } = req.body
        connect()
        connection.query('INSERT INTO country set ?', { name: name }, (err, data) => {
            if (err) console.log(err)
            return res.redirect('back')
        })
    }

    addCountryForMovie(req, res) {
        const { movie, actor } = req.params
        connect()
        connection.query('INSERT INTO production_country set ?', { movieID: movie, countryID: actor }, (err, data) => {
            if (err) return console.log(err)
            res.redirect('back')
        })
    }

    deleteHandleActor(req, res, next) {
        const id = req.params.id
        connect();
        connection.query('DELETE FROM movie_actors WHERE actorsID = ?', id, (err) => {
            if (!err) {
                connection.query('DELETE FROM actors WHERE actorsID = ?', id, (err) => {
                    if (!err) {
                        res.redirect('back')
                        console.log('xoa thanh cong')
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err)
            }
        })
    }

    deleteHandleCategory(req, res, next) {
        const id = req.params.id
        connect();
        connection.query('DELETE FROM movie_category WHERE categoryID  = ?', id, (err) => {
            if (!err) {
                connection.query('DELETE FROM category WHERE categoryID  = ?', id, (err) => {
                    if (!err) {
                        res.redirect('back')
                        console.log('xoa thanh cong')
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err)
            }
        })
    }

    deleteHandleCountry(req, res, next) {
        const id = req.params.id
        connect();
        connection.query('DELETE FROM production_country WHERE 	countryID   = ?', id, (err) => {
            if (!err) {
                connection.query('DELETE FROM country WHERE countryID   = ?', id, (err) => {
                    if (!err) {
                        res.redirect('back')
                        console.log('xoa thanh cong')
                    } else {
                        console.log(err);
                    }
                })
            } else {
                console.log(err)
            }
        })
    }

    //PUT /handle-form-action/edit-actor-cat-country/:id/:value/:name gôm cat actor country chung 1 đường dẫn update
    handleEditActor(req, res, next) {
        const { id, value, name } = req.params
        if (name) {
            switch (name) {
                case 'actors':
                    connect();
                    connection.query(`UPDATE ${name} SET name=? WHERE actorsID=?`, [value, id], (err) => {
                        if (err) console.log('lỗi edit actor')
                        res.redirect('back');
                    })
                    break;
                case 'category':
                    connect();
                    connection.query(`UPDATE ${name} SET name=? WHERE categoryID=?`, [value, id], (err) => {
                        if (err) console.log('lỗi edit category')
                        res.redirect('back');
                    })
                    break;
                case 'country':
                    connect();
                    connection.query(`UPDATE ${name} SET name=? WHERE countryID =?`, [value, id], (err) => {
                        if (err) console.log('lỗi edit country')
                        res.redirect('back');
                    })
                    break;
                default:
                    res.json('không tồn tại')
            }
        }
    }
}



module.exports = new adminController();
