const express = require('express');
const router = express.Router();

const movieController = require('../controllers/MovieControllers');

// router.get('/connect/getId', movieController.movieGetId);
router.get('/danh-sach/phim-de-cu', movieController.listPdc);
router.get('/danh-sach/phim-moi-cap-nhat', movieController.listPmcn);
router.post('/create', movieController.store);
router.get('/json', movieController.json);
router.get('/create', movieController.create);
router.get('/before', movieController.before);
router.get('/register', movieController.register);
router.post('/profile', movieController.profile);
router.get('/login', movieController.login);
router.post('/login-handle', movieController.loginHandle);
router.get('/:slug', movieController.watchMovie);
router.get('/', movieController.home);


module.exports = router;
