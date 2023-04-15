const { filmModel, Film } = require("../models/film.model")
const messages = require("../helpers/messages")
const { Types } = require("mongoose")
const { userModel } = require("../models/user.model")

const add_film = async (film, user) => {
  let datetime = Number(new Date())
  film._id = new Types.ObjectId()
  film.created_at = datetime;
  film.updated_at = datetime;
  film.number_of_like = 0;
  film.number_of_unlike = 0;
  film.user_id = user._id

  try {
    const new_film = await filmModel.create(film)
    
    return new_film
  } catch (error) {
    throw {
      error: error,
      message: error.message
    }
  }

}

const list_films = async () => {
  try {
    const films = await filmModel.find({})
    const list_of_films = films.map(async (film) => {
      const user = await userModel.findById(film.user_id)

      return {
                id: film._id,
                film_title: film.film_title,
                film_description: film.film_description,
                number_of_like: film.number_of_like,
                number_of_unlike: film.number_of_unlike,
                flatform: film.flatform,
                film_link : film.film_link,
                shared_by: user?.username,
                updated_at: film.updated_at,
                created_at: film.created_at,
              };
    })
    
    return await Promise.all(list_of_films)
  } catch (error) {
    throw {
      error: error,
      message: error.message
    }
  }
}

module.exports = {
  add_film,
  list_films
}