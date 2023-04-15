var express = require('express');
const { middleware } = require('../middlewares/jwt.middleware');
const { list_films, add_film } = require('../controllers/film.controller');
const { Film } = require('../models/film.model');
const ValidateService = require('../services/validate.service');
var router = express.Router();

router.get('/list_films', async (req, res, next) => {
  try {
    const films = await list_films();

    res.send({ message: "Success", data: films });
  } catch (error) {
    res.send({message: error.message, error: error.error})
  }
  
})

router.use(middleware)

router.post('/add_film', async (req, res, next) => {
  let film = new Film(req.body)
  let validate = new ValidateService(req.body)
  validate.required(["film_link", "film_title"])
  validate.validateLink();

  if (validate.hasError())
    return res.send({ message: "Add new film failed", errors: validate.errors });

  try {
    const new_film = await add_film(film, req.user)

    res.send({message: 'Add film successfully', data: new_film})
  } catch (error) {
    res.send({message: error.message, error: error.error})
  }
});

module.exports = router;
