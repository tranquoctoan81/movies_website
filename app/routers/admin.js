const express = require('express');
const router = express.Router();

const adminController = require('../controllers/AdminControllers');

// router.get('/search/course', siteController.searchCourse);
router.post('/handle-form-action', adminController.handleFormAction)
router.delete('/:id', adminController.delete);
router.get('/movie-manager', adminController.movieManager);
router.get('/user-manager', adminController.userManager);
router.get('/', adminController.home);


module.exports = router;
