export function setHeaderInfo(ctx) {
    ctx.isAuth = sessionStorage.getItem("authtoken") !== null;
    ctx.fullName = sessionStorage.getItem("fullName");
}

export function getPartials() {
    return {
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs"
    }
}

export function handleError(msg) {
    console.error(msg)
}

export function getUserId() {
    return sessionStorage.getItem("userId");
}

export function displayLoading() {
    const loadingBox = document.getElementById("loadingBox");
    loadingBox.style.display = "block";
}

export function displayError(message) {
    const errorBox = document.getElementById("errorBox");
    errorBox.style.display = "block";
    errorBox.textContent = message;
    errorBox.addEventListener("click", function () {
        errorBox.style.display = "none";
    });
}

export function displaySuccess(message) {
    const successBox = document.getElementById("successBox");
    successBox.style.display = "block";
    successBox.textContent = message;
    successBox.addEventListener("click", function () {
        successBox.style.display = "none";
    });

    setTimeout(() => {
        successBox.style.display = "none";
    }, 5000);
}