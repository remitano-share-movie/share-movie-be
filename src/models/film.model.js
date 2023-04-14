const mongoose = require('mongoose');
const flatforms = {
  other: 0,
  youtube: 1
}

class Film {
  constructor({
      id=null,
      film_title=null,
      film_description='This is a funny film',
      number_of_like=null,
      number_of_unlike=null,
      flatform=0,
      film_link=null,
      user_id=null,
      created_at=null,
      updated_at=null,
  }) {
    this._id = id;
    this.film_title = film_title;
    this.film_description = film_description;
    this.number_of_like = number_of_like;
    this.number_of_unlike = number_of_unlike;
    this.flatform = flatforms[flatform];
    this.film_link = film_link;
    this.user_id = user_id;
    this.updated_at = updated_at;
    this.created_at = created_at;
  }

  get_platform = () => {
    return Object.keys(flatforms).find(key => flatforms[key] === this.flatform);
  }
}

const filmSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  film_title: {
      type: String,
      required: true,
      index: true,
    },
  film_description: String,
  number_of_like: Number,
  number_of_unlike: Number,
  flatform: Number,
  film_link: {
    type: String,
    required: true,
    index: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  updated_at: Number,
  created_at: Number,
}, {versionKey: false});

const filmModel = mongoose.model('film', filmSchema);

module.exports = {
  Film,
  filmModel
}