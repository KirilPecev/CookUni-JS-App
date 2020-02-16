const host = "https://baas.kinvey.com";
const appKey = "kid_ryE-YlLzU";
const appSecret = "73ecd275dd0c4d4d89252609acfb2671";


function createAuthorization(type) {
    return type === "Basic"
        ? `Basic ${btoa(`${appKey}:${appSecret}`)}`
        : `Kinvey ${sessionStorage.getItem("authtoken")}`;
}

function createHeader(type, httpMethod, data) {
    const headers = {
        method: httpMethod,
        headers: {
            "Authorization": createAuthorization(type),
            "Content-Type": "application/json"
        }
    };

    if (httpMethod === "POST" || httpMethod === "PUT") {
        headers.body = JSON.stringify(data);
    }

    return headers;
}

function deserializeData(x) {
    if (x.status === 204) {
        return x;
    }

    return x.json();
}

function handleError(e) {
    if (!e.ok) {
        throw new Error(e.statusText);
    }

    return e;
}

function fetchData(kinveyModule, endpoint, headers) {
    const url = `${host}/${kinveyModule}/${appKey}/${endpoint}`;

    return fetch(url, headers)
        .then(handleError)
        .then(deserializeData);
}

export function get(kinveyModule, endpoint, type) {
    const header = createHeader(type, "GET");
    return fetchData(kinveyModule, endpoint, header);
}

export function post(kinveyModule, endpoint, data, type) {
    const header = createHeader(type, "POST", data);
    return fetchData(kinveyModule, endpoint, header);
}

export function put(kinveyModule, endpoint, data, type) {
    const header = createHeader(type, "PUT", data);
    return fetchData(kinveyModule, endpoint, header);
}

export function del(kinveyModule, endpoint, type) {
    const header = createHeader(type, "DELETE");
    return fetchData(kinveyModule, endpoint, header);
}