import { useRecipesContext } from "../hooks/useRecipesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import PropTypes from "prop-types";

const RecipeDetails = ({ recipe, passDataToForm, toggleForm }) => {
  const { dispatch } = useRecipesContext();

  const handleClickDelete = async () => {
    const response = await fetch(
      "http://localhost:4000/api/recipes/" + recipe._id,
      {
        method: "DELETE",
      },
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
    }
  };

  let handleEdit = () => {
    passDataToForm(recipe);
    toggleForm();
  };

  return (
    <div className="recipe-details">
      <div className="coverImage">
        <img src={recipe.image_secure_url} alt="recipe" />
      </div>
      <h4>{recipe.title}</h4>
      <strong>Ingredients: </strong>
      <ul>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>{ingredient}</li>
        ))}
      </ul>

      <strong>Instructions: </strong>
      <ol>
        {recipe.instructions.map((instruction, i) => (
          <li key={i}>{instruction}</li>
        ))}
      </ol>

      <p>
        added&nbsp;
        {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
      </p>
      <span
        className="material-symbols-outlined delete"
        onClick={handleClickDelete}
      >
        delete
      </span>
      <span className="material-symbols-outlined edit" onClick={handleEdit}>
        edit
      </span>
    </div>
  );
};

RecipeDetails.propTypes = {
  recipe: PropTypes.any,
};

export default RecipeDetails;
