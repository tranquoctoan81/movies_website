const { getAllUser, insertData } = require('../models/database'); //connect mysql
class SiteController {

    create(req, res) {
        res.render('movies/create')
    }

    store(req, res) {
        res.send(123)
    }

    //GET locahost/home
    home(req, res, next) {
        res.render('home');
    }
    // watchMovie(req, res, next) {
    //     res.render('movies/watchMovie');
    // }




    connect(req, res) {
        getAllUser(function (movies) {
            res.render('home1', { movies: movies });
        })
    }

    //[GET] /movie/getId
    movieGetId(req, res) {
        getId(function (movies) {
            res.json(movies)
        })
    }





    json(req, res) {
        getAllUser(function (resultQuery) {
            res.json(resultQuery)
        })
    }

}
module.exports = new SiteController();
