import { get, put, del, post } from "../requestor.js";
import { handleError, getPartials, setHeaderInfo, getUserId, displaySuccess, displayLoading } from "./shared.js";

let recipe = {};

export function getRecipe(ctx) {
    let id = this.params["id"];
    setHeaderInfo(ctx);
    get("appdata", `recipes/${id}`, "Kinvey")
        .then(x => {
            this.loadPartials(getPartials())
                .partial("../templates/recipe/recipe.hbs");
            ctx.recipe = x;
            recipe = x;
            ctx.isAuthorAuth = getUserId() === x._acl.creator;
        })
        .catch(handleError);
}

export function likeRecipe(ctx) {
    let id = this.params["id"];
    recipe.likesCounter++;
    put("appdata", `recipes/${id}`, recipe, "Kinvey")
        .then(() => {
            displaySuccess("You liked that recipe.");
            ctx.redirect(`/recipe/${id}`);
        })
        .catch(handleError);
}

export function deleteRecipe(ctx) {
    let id = this.params["id"];
    displayLoading();
    del("appdata", `recipes/${id}`, "Kinvey")
        .then(() => {
            displaySuccess("Your recipe was archived.");
            ctx.redirect("/");
        })
        .catch(handleError);
}

export function shareRecipe(ctx) {
    setHeaderInfo(ctx);
    this.loadPartials(getPartials())
        .partial("../templates/recipe/share.hbs");
}

export function postRecipe(ctx) {
    let { meal, ingredients, prepMethod, description, foodImageURL, category } = ctx.params;
    displayLoading();
    if (validateData(meal, ingredients.split(", "), prepMethod, description, foodImageURL, category)) {
        let data = {
            "meal": meal,
            "ingredients": ingredients.split(", "),
            "prepMethod": prepMethod,
            "description": description,
            "foodImageURL": foodImageURL,
            "category": category,
            "likesCounter": 0,
            "categoryImageURL": `https://${category}`
        };
        post("appdata", "recipes", data, "Kinvey")
            .then(() => {
                displaySuccess("Recipe shared successfuly!");
                ctx.redirect("/");
            })
            .catch(handleError);
    }
}

export function getEditRecipe(ctx) {
    let id = ctx.params["id"];
    setHeaderInfo(ctx);
    get("appdata", `recipes/${id}`, "Kinvey")
        .then(x => {
            this.loadPartials(getPartials())
                .partial("../templates/recipe/edit.hbs");
            ctx.recipe = x;
            ctx.recipe.ingredients = x.ingredients.join(", ");
            recipe = x;
        })
        .catch(handleError);
}

export function editRecipe(ctx) {
    let { meal, ingredients, prepMethod, description, foodImageURL, category } = ctx.params;
    displayLoading();
    if (validateData(meal, ingredients.split(", "), prepMethod, description, foodImageURL, category)) {
        let data = {
            "meal": meal,
            "ingredients": ingredients.split(", "),
            "prepMethod": prepMethod,
            "description": description,
            "foodImageURL": foodImageURL,
            "category": category,
            "likesCounter": recipe.likesCounter,
            "categoryImageURL": recipe.categoryImageURL
        };
        put("appdata", `recipes/${recipe._id}`, data, "Kinvey")
            .then(() => {
                displaySuccess("Recipe edited successfuly!");
                ctx.redirect("/");
            })
            .catch(handleError);
    }
}

function validateData(meal, ingredients, prepMethod, description, foodImageURL, category) {
    if (meal.length >= 4
        && ingredients.length >= 2
        && prepMethod.length >= 10
        && description.length >= 10
        && (foodImageURL.startsWith("http://") || foodImageURL.startsWith("https://"))
        && category) {
        return true;
    }

    return false;
}