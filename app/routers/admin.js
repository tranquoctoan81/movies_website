const express = require('express');
const router = express.Router();
const { authUser } = require('../../middleware/basicAuth')

const adminController = require('../controllers/AdminControllers');

// router.get('/search/course', siteController.searchCourse);
router.post('/add-actor/:movie/:actor', adminController.addActorForMovie);
router.post('/add-cat/:movie/:actor', adminController.addCatForMovie);
router.post('/add-country/:movie/:actor', adminController.addCountryForMovie);
router.post('/handle-form-action', adminController.handleFormAction)
router.post('/add-new-actor', adminController.addNewActor);
router.post('/add-new-cat', adminController.addNewCat);
router.post('/add-new-country', adminController.addNewCountry);
router.post('/handle-form-action/movie', adminController.handleFormActionMovie)
router.post('/handle-form-action/create', adminController.createMovie)
router.delete('/handle-form-action/delete-actor/:id', adminController.deleteHandleActor)
router.delete('/handle-form-action/delete-category/:id', adminController.deleteHandleCategory)
router.delete('/handle-form-action/delete-country/:id', adminController.deleteHandleCountry)
router.put('/handle-form-action/edit-actor-cat-country/:id/:value/:name', adminController.handleEditActor)
router.delete('/:id', adminController.delete);
router.delete('/:id/movie', adminController.deleteMovie);
router.put('/:slug', adminController.updateHandleForm);
router.get('/movie-manager', adminController.movieManager);
router.get('/movie-manager/create', adminController.create);
router.get('/movie-manager/add-actor', adminController.addActor);
router.get('/movie-manager/add-cat', adminController.addCat);
router.get('/movie-manager/add-country', adminController.addCountry);
router.get('/user-manager', adminController.userManager);
router.get('/:slug/update', adminController.update);
router.get('/', adminController.home);


module.exports = router;
