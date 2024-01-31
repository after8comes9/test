const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    instructions: {
      type: Array,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recipe", recipeSchema);
