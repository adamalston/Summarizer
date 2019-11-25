// import axios from "node_modules/axios/dist/axios.min";
//api key 9720744B0C
/**
 * How to make an API request to SMMRY
 * 
 */
function addButtonListeners() {
    $("#signupButton").on('click', () => {
        // add an async method to create account
    });
    $("#loginButton").on('click', () => {
        // add an async method to authenticate user
    });
    $("#summarizeButton").on('click', () => {
        // add an async method to get the summary
    });
}

async function postCredentials() {
    let newName = $("#newName").val();
    let newPass = $("#newPass").val();

    const postcred = await axios ({
        method: "post",
        url: "http://localhost:3000/account/create",
        body: {
            "name": newName,
            "pass": newPass,
            "data": {

            },
        },
    });
}

$(document).ready(() => {
    addButtonListeners();
});



