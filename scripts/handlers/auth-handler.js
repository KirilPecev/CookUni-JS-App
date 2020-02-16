import { post } from "../requestor.js";
import { getPartials, handleError, displayError, displaySuccess, displayLoading } from "./shared.js"

export function getRegister(ctx) {
    this.loadPartials(getPartials())
        .partial("./templates/auth/register.hbs");
};

export function postRegister(ctx) {
    const { username, password, repeatPassword, firstName, lastName } = ctx.params;
    displayLoading();
    let isValid = validateInputData(firstName, lastName, username, password, repeatPassword);
    if (isValid) {
        post("user", "", { username, password, firstName, lastName }, "Basic")
            .then(userInfo => {
                saveInfo(userInfo);
                displaySuccess("User registration successful.");
                ctx.redirect("/");
            })
            .catch(handleError);
    } else {
        displayError("Invalid registration.");
    }
}

export function getLogin(ctx) {
    this.loadPartials(getPartials())
        .partial("./templates/auth/login.hbs");
}

export function getLogout(ctx) {
    post("user", "_logout", {}, "Kinvey")
        .then(() => {
            clearInfo();
            displaySuccess("Logout successful.");
            ctx.redirect("/");
        })
        .catch(handleError);
}

export function postLogin(ctx) {
    let username = ctx.params["username"];
    let password = ctx.params["password"];
    displayLoading();
    post("user", "login", { username, password }, "Basic")
        .then(userInfo => {
            saveInfo(userInfo);
            displaySuccess("Login successful.");
            ctx.redirect("/");
        })
        .catch(() => displayError("Invalid username or password."));
}

function validateInputData(firstName, lastName, username, password, repeatPassword) {
    if (firstName.length >= 2
        && lastName.length >= 2
        && username.length >= 3
        && password.length >= 6
        && password == repeatPassword) {
        return true;
    }

    return false;
}

function saveInfo(info) {
    sessionStorage.setItem("authtoken", info._kmd.authtoken);
    sessionStorage.setItem("fullName", `${info.firstName} ${info.lastName}`);
    sessionStorage.setItem("userId", info._id);
}

function clearInfo() {
    sessionStorage.clear();
}