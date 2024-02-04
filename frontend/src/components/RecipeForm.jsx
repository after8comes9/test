import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";
import PropTypes from "prop-types";

const RecipeForm = (props) => {
  const { dispatch } = useRecipesContext();

  const initialState = [""];

  const [title, setTitle] = useState(props.title || "");
  const [ingredients, setIngredients] = useState(
    props.ingredients || initialState,
  );
  const [instructions, setInstructions] = useState(
    props.instructions || initialState,
  );
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState(props.image || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipe = { title, ingredients, instructions, previewSource };

    const response = await fetch("http://localhost:4000/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      /* setEmptyFields([]);
            setError(null);
            setTitle("");
            setIngredients([""]);
            setInstructions([""]);*/
      dispatch({ type: "CREATE_RECIPE", payload: json });
      props.toggleForm();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    props.toggleForm();
  };

  function addIngredient(index, newIngredient) {
    const newArray = ingredients.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newIngredient;
      } else {
        // The rest don't change
        return item;
      }
    });
    setIngredients(newArray);
  }

  function addInstruction(index, newInstruction) {
    const newArray = instructions.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newInstruction;
      } else {
        // The rest don't change
        return item;
      }
    });
    setInstructions(newArray);
  }

  let removeIngredient = (i) => {
    if (ingredients.length === 1) {
      return initialState;
    }
    return [...ingredients.slice(0, i).concat(...ingredients.slice(i + 1))];
  };

  let removeInstruction = (i) => {
    if (instructions.length === 1) {
      return initialState;
    }
    return [...instructions.slice(0, i).concat(...instructions.slice(i + 1))];
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
    setFileInputState(e.target.fileName);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      {!props.title && <h3>Add a New Recipe</h3>}
      {props.title && <h3>Edit Recipe</h3>}

      <label>Recipe Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>Ingredients:</label>
      <ul>
        {ingredients.map((ingredient, i) => (
          <li key={i}>
            <input
              type="string"
              onChange={(e) => {
                let newIngredient = e.target.value;
                addIngredient(i, newIngredient);
              }}
              value={ingredient}
              className={emptyFields.includes("ingredients") ? "error" : ""}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setIngredients(removeIngredient(i));
              }}
              className="material-symbols-outlined trash"
            >
              delete
            </button>
          </li>
        ))}
      </ul>
      <div
        className="addListItem"
        onClick={(e) => {
          e.preventDefault();
          setIngredients([...ingredients, ""]);
        }}
      >
        <span className="material-symbols-outlined">add</span>
        <p className="addText">add an ingredient</p>
      </div>

      <label>Instructions:</label>
      <ol>
        {instructions.map((instruction, i) => (
          <li key={i}>
            <input
              type="string"
              onChange={(e) => {
                let newInstruction = e.target.value;
                addInstruction(i, newInstruction);
              }}
              value={instruction}
              className={emptyFields.includes("instructions") ? "error" : ""}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setInstructions(removeInstruction(i));
              }}
              className="material-symbols-outlined trash"
            >
              delete
            </button>
          </li>
        ))}
      </ol>
      <div
        className="addListItem"
        onClick={(e) => {
          e.preventDefault();
          setInstructions([...instructions, ""]);
        }}
      >
        <span className="material-symbols-outlined">add</span>
        <p className="addText">add a step</p>
      </div>
      <label>Image:</label>
      <br />
      {previewSource && (
        <>
          <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
          <label className="addListItem" htmlFor="imageUpload">
            <span className="material-symbols-outlined">add</span>
            <p className="addText">Change the image</p>
          </label>
        </>
      )}
      {!previewSource && (
        <label className="addListItem" htmlFor="imageUpload">
          <span className="material-symbols-outlined">add</span>
          <p className="addText">Upload an image</p>
        </label>
      )}
      <input
        id="imageUpload"
        type="file"
        name="image"
        style={{ visibility: "hidden" }}
        onChange={handleFileInputChange}
        value={fileInputState || ""}
        className={emptyFields.includes("previewSource") ? "error" : ""}
      />
      <button className="save">Save Recipe</button>
      <button className="cancel" onClick={handleCancel}>
        Cancel
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

RecipeForm.propTypes = {
  toggleForm: PropTypes.any,
  title: PropTypes.any,
  ingredients: PropTypes.any,
  instructions: PropTypes.any,
  image: PropTypes.any,
};

export default RecipeForm;
