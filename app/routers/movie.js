const express = require('express');
const router = express.Router();
const { cookieJwtAuth, updateViews, getUserID, getUserName } = require('../../middleware/basicAuth')

const movieController = require('../controllers/MovieControllers');

// router.get('/connect/getId', movieController.movieGetId);
router.post('/appreciate', cookieJwtAuth, getUserID, movieController.appreciate)
router.get('/update-info/:username', movieController.userUpdateInfo)
router.put('/update-info/handle/:username', movieController.userUpdateHandle)
router.get('/search', movieController.search);
router.get('/categories/:catName', movieController.searchCat);
router.get('/year/:year', movieController.searchYear);
router.get('/country/:country', movieController.searchCountry);
router.get('/danh-sach/phim-de-cu', movieController.listPdc);
router.get('/danh-sach/phim-moi-cap-nhat', movieController.listPmcn);
router.post('/create', movieController.store);
router.get('/json', movieController.json);
router.get('/json-desc', movieController.jsonDesc);
router.get('/json-category', movieController.jsonCategory);
router.get('/json-country', movieController.jsonCountry);
router.get('/json-series-old', movieController.jsonMovieHot);
router.get('/json-series-recommende', getUserName, getUserID, movieController.jsonRecommendedMovies);
router.get('/json-actors', movieController.jsonActors);
router.get('/create', movieController.create);
router.get('/before', movieController.before);
router.get('/register', movieController.register);
router.post('/profile', movieController.profile);
router.get('/login', movieController.login);
router.get('/login/forgot-password-handle', movieController.forgotPassword)
router.post('/login/forgot-password-handle/secret', movieController.forgotPasswordSecret)
router.post('/login/forgot-password-handle/last-step', movieController.forgotPasswordLassStep)
router.post('/login/change-password', movieController.changePassword)
router.get('/logout', movieController.logout);
router.post('/login-handle', movieController.loginHandle);
router.get('/:slug', cookieJwtAuth, updateViews, movieController.watchMovie);
router.get('/', movieController.home);


module.exports = router;
