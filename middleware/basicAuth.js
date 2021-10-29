require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken')
const { connect, connection } = require('../app/models/database');
function authUser(req, res, next) {
    if (req.body.username == null) {
        res.status(403);
        return res.send('ban can dang nhap')
    }
    next();
}


function cookieJwtAuth(req, res, next) {
    const token = req.cookies.token
    if (!token) {
        return res.redirect('/login')
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.redirect('/login')
        else {
            req.username = data.username
            connect();
            connection.query("SELECT * FROM users WHERE username = ?", data.username, function (err, result, fields) {
                if (err) console.log(err)
                if (result) {
                    req.data = result[0]
                    next()
                }
            });
        }
    })
}


function authToken(req, res, next) {
    const authorizationHeader = req.headers['Authorization']
    const token = authorizationHeader.split(' ')[1]
    if (!token) res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data, next) => {
        if (err) return res.status(400).json({ message: 'Lỗi Token' })
        next()
    })
}


function updateViews(req, res, next) {
    connect();
    connection.query("SELECT * FROM users WHERE username = ?", req.username, function (err, result, fields) {
        const userID = result[0].usersID
        let slug = req.params
        let moviesID
        Object.keys(slug).forEach(function (key) {
            return slug = slug[key]
        })
        if (slug === 'favicon.ico') {
            next()
        } else {
            connection.query("SELECT * FROM movie WHERE movie.slug = ? ", slug, function (err, data, fields) {
                if (data) {
                    moviesID = data[0].movieID
                    connection.query("INSERT INTO users_movie SET ?", { movieID: moviesID, usersID: userID }, (err, result) => {
                        if (err) console.log(err)
                    })
                }
            })
        }
        next()
    });
}




function checkAdmin(req, res, next) {
    const role = req.data.role
    if (role != 1) {
        return res.json('bạn không đủ quyền truy cập')
    }
    if (role === 1) {
        next()
    }
}


function cookieLogin(req, res, next) { //hiện username khi login
    const token = req.cookies.token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (!data) {
            next()
        }
        if (data) {
            req.data = (data.username)
            next()
        }
    })
}

module.exports = {
    authUser,
    authToken,
    cookieJwtAuth,
    checkAdmin,
    cookieLogin,
    updateViews
};
