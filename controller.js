// import axios from "node_modules/axios/dist/axios.min";
// api key 9720744B0C
/**
 * How to make an API request to SMMRY
 */

function hideElements() {
    $(".signupError").hide();
    $(".loginError").hide();
    $(".summarizeError").hide();
}

// function hideButtons() {
//     $(".logoutButton").hide();
// }

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
            newAccount();
            // synchoronize removal of loading icon and newAccount
            $("#signupButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#loginButton").on('click', () => {
        $("#loginButton").toggleClass('is-loading');
        $(".fa-id-badge, .fa-lock").css("color", "#009fff");

        setTimeout(()=> {
            postLogin();
            $("#loginButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#logoutButton").on('click', () => {
        $("#logoutButton").toggleClass('is-loading');

        setTimeout(()=> {
            logout();
            $("#logoutButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirSignupButton").on('click', () => {
        $("#redirSignupButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "signup.html";
            $("#redirSignupButton").removeClass('is-loading');
        }, 250);
    });
    
    $("#redirLoginButton").on('click', () => {
        $("#redirLoginButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "login.html" ;
            $("#redirLoginButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirGithubButton").on('click', () => {
        $("#redirGithubButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "https://github.com/adamalston/Summarizer";
            $("#redirGithubButton").removeClass('is-loading');
        }, 250);
    });
    
    $("#summarizeButton").on('click', () => {
        $("#summarizeButton").toggleClass('is-loading');
        
        setTimeout(()=> {
            $("#summarizeButton").removeClass('is-loading');
            // add an async method to get the summary
            summarize();
        }, 250);
    });

    $(".navbar-burger").on('click', () => {
        // Toggle is-active class on both the navbar-burger and the navbar-menu
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
}

async function newAccount() {
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

    let result = axios.post('http://localhost:3000/account/login', {
        "name": $("#name").val(),
        "pass": $("#pass").val(),
    });

    result.then(response => {
        // console.log("we're in")
        let jwt = response.data.jwt;
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', response.data.name);
        window.location.replace("index.html");
    }).catch(error => {
        $(".loginError").show();
        $(".fa-id-badge, .fa-lock").css("color", "red");
    });
}

export const logout = function () {
    if (localStorage.getItem("jwt") != null) {
        localStorage.removeItem("jwt");
        window.location.replace("login.html");
    }
}

const smmryURL = axios.create({
    baseURL: "https://api.smmry.com/&SM_API_KEY=9720744B0C&SM_LENGTH=5&SM_URL="
});

async function summarize() {
    try {
        let url = $("#url").val();
        console.log(url);
        const result = await smmryURL.get(`${url}`,{
            "async": true,
            "crossDomain": true,
            "headers": {
                "Access-Control-Allow-Origin": false,
            }
        });
        let title = result.sm_api_title;
        let body = result.sm_api_content;
        console.log(result.smi_api_message);
        console.log(title);
        console.log(body);
        $("#title").innerHTML = title;
        $("#content").innerHTML = body;
        console.log("success");
    } catch (error) {
        console.log("error");
        $(".summarizeError").show();
    }
}

let blinker = document.getElementById('blink');
setInterval(function() {
    blinker.style.display = (blinker.style.display == 'none' ? '' : 'none');
}, 1000); 

$(document).ready(() => {
    hideElements();
    // hideButtons();
    addButtonListeners();
});