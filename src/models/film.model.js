const mongoose = require('mongoose');

class Film {
  flatforms = {
    youtube: 1
  }
  constructor({
      film_title=null,
      film_description=null,
      number_of_like=null,
      number_of_unlike=null,
      flatform=null,
      film_token=null,
      shared_by=null,
      created_at=null,
      updated_at=null,
  }) {
    this.film_title = film_title;
    this.film_description = film_description;
    this.number_of_like = number_of_like;
    this.number_of_unlike = number_of_unlike;
    this.flatform = flatforms[flatform];
    this.film_token = film_token;
    this.shared_by = shared_by;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }
}

const filmSchema = new mongoose.Schema({
  film_title: String,
  film_description: Text,
  number_of_like: Number,
  number_of_unlike: Number,
  username: Number,
  film_link: String,
  shared_by: mongoose.Schema.Types.ObjectId,
  updated_at: Number,
  created_at: Number,
}, {versionKey: false});

const filmModel = mongoose.model('film', filmSchema);

module.exports = {
  Film,
  filmModel
}