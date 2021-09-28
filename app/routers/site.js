const express = require('express');
const router = express.Router();
const database = require('../models/database'); //connect mysql

const siteController = require('../controllers/SiteControllers');

// router.get('/search/course', siteController.searchCourse);
router.get('/connect', siteController.connect);
router.get('/connect/getId', siteController.movieGetId);
router.get('/create', siteController.create);
router.post('/create', siteController.store);
// router.get('/movie', siteController.watchMovie);
router.get('/json', siteController.json);
router.get('/', siteController.home);

module.exports = router;
