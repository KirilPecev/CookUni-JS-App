import { getRegister, postRegister, getLogin, getLogout, postLogin } from "./handlers/auth-handler.js";
import { getIndex } from "./handlers/home-handler.js";
import { getRecipe, likeRecipe, deleteRecipe, shareRecipe, postRecipe, getEditRecipe, editRecipe } from "./handlers/recipe-handler.js";

const app = Sammy("#rooter", function () {
    this.use("Handlebars", "hbs");

    this.get("/", getIndex);

    this.get("/register", getRegister);

    this.post("/register", postRegister);

    this.get("/login", getLogin);

    this.get("/logout", getLogout);

    this.post("/login", postLogin);

    this.get("/recipe/:id", getRecipe);

    this.get("/like/:id", likeRecipe);

    this.get("/archive/:id", deleteRecipe);

    this.get("/share", shareRecipe);

    this.post("/share", postRecipe);

    this.get("/edit/:id", getEditRecipe);

    this.post("/edit", editRecipe);
});

app.run();
