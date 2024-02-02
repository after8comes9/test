import { useState, useEffect } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";

// components
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";

const Home = () => {
  const { recipes, dispatch } = useRecipesContext();
  const [addRecipe, setAddRecipe] = useState(false);
  const [formData, setFormData] = useState();

  function toggleForm() {
    setAddRecipe((addRecipe) => !addRecipe);
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("http://localhost:4000/api/recipes");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
      }
    };

    fetchRecipes();
  }, [dispatch]);

  return (
    <div className="home">
      {!addRecipe && (
        <div className="recipes">
          {recipes &&
            recipes.map((recipe) => (
              <RecipeDetails
                toggleForm={toggleForm}
                recipe={recipe}
                key={recipe._id}
                passDataToForm={(formData) => setFormData(formData)}
              />
            ))}
          <div onClick={toggleForm}>
            <span className="material-symbols-outlined">add</span>
            <p>Add recipe</p>
          </div>
        </div>
      )}
      {addRecipe && (
        <RecipeForm
          recipe={formData}
          toggleForm={toggleForm}
          passDataToForm={(formData) => setFormData(formData)}
        />
      )}
    </div>
  );
};

export default Home;
