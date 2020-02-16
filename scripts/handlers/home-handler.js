import { setHeaderInfo, getPartials, handleError } from "./shared.js"
import { get } from "../requestor.js";

export function getIndex(ctx) {
    setHeaderInfo(ctx);
    let partials = getPartials();
    partials.recipes = "./templates/recipe/recipes.hbs";
    if (ctx.isAuth) {
        get("appdata", "recipes", "Kinvey")
            .then(x => {
                this.loadPartials(partials)
                    .partial("./templates/home.hbs");
                ctx.recipes = x;
            })
            .catch(handleError);
    }
    else {
        this.loadPartials(partials)
            .partial("./templates/home.hbs");
    }
}