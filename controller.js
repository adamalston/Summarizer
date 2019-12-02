// import axios from "node_modules/axios/dist/axios.min";
//api key 9720744B0C
/**
 * How to make an API request to SMMRY
 * 
 */


function hideElements() {
    $(".signupError").hide();
    $(".loginError").hide();
}
const smmryURL = axios.create({
    baseURL: "https://api.smmry.com/SM_API_KEY=9720744B0C"
});

const accountRoot = axios.create({
    baseURL: "http://localhost:3000/account"
});

function addButtonListeners() {
    $("#signupButton").on('click', () => {
        hideElements();
        postCredentials();
    });
    $("#loginButton").on('click', () => {
        hideElements();
        postLogin();
    });
    $("#summarizeButton").on('click', () => {
        // add an async method to get the summary
    });
}

async function postCredentials() {
    try {
        const result = await accountRoot.post(`/create`,{
            "name": $("#newName").val(),
            "pass": $("#newPass").val(),
            "data": {
                "firstname": $("#firstname").val(),
                "lastname": $("#lastname").val(),
            }
        });

        window.location.replace("login.html");
    } catch (error) {
        $(".signupError").show();
    } 
}

async function postLogin() {
    try {
        const result = await accountRoot.post(`/login`,{
        "name": $("#name").val(),
        "pass": $("#pass").val(),
    });
        window.location.replace("index.html");
    } catch (error) {
        $(".loginError").show();
    }
}

$(document).ready(() => {
    hideElements();
    addButtonListeners();
});



