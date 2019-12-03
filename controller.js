// import axios from "node_modules/axios/dist/axios.min";
// api key 9720744B0C
/**
 * How to make an API request to SMMRY
 * 
 */


function hideElements() {
    $(".signupError").hide();
    $(".loginError").hide();
    $(".summarizeError").hide();

}
const smmryURL = axios.create({
    baseURL: "https://api.smmry.com/SM_API_KEY=9720744B0C"
});

const accountRoot = axios.create({
    baseURL: "http://localhost:3000/account"
});

function addButtonListeners() {
    $("#signupButton").on('click', () => {
        // show loading icon
        $("#signupButton").toggleClass('is-loading');
        // revert icon color on each button click
        $(".fa-id-badge").css("color", "#009fff");

        setTimeout(()=> {
            postCredentials();
            // synchoronize removal of loading icon and postCredentials
            $("#signupButton").removeClass('is-loading');
        }, 250)

        hideElements();
    });

    $("#loginButton").on('click', () => {
        $("#loginButton").toggleClass('is-loading');
        $(".fa-id-badge, .fa-lock").css("color", "#009fff");

        setTimeout(()=> {
            postLogin();
            $("#loginButton").removeClass('is-loading');
        }, 250)

        hideElements();
    });

    $("#redirButton").on('click', () => {
        $("#redirButton").toggleClass('is-loading');

        setTimeout(()=> {
            $("#redirButton").removeClass('is-loading');
        }, 250)
    });
    
    $("#summarizeButton").on('click', () => {
        $("#summarizeButton").toggleClass('is-loading');
        
        setTimeout(()=> {
            $("#summarizeButton").removeClass('is-loading');
            // add an async method to get the summary
            summarize();
        }, 250)
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
        // change icon color to red indicating error in field
        $(".fa-id-badge").css("color", "red");
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
        $(".fa-id-badge, .fa-lock").css("color", "red");
    }
}

async function summarize() {
    try {

    } catch (error) {
        $(".summarizeError").show();
    }
}

$(document).ready(() => {
    hideElements();
    addButtonListeners();

    $(".navbar-burger").click(function() {
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
});



