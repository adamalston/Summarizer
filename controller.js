// import axios from "node_modules/axios/dist/axios.min";
// api key 9720744B0C
/**
 * How to make an API request to SMMRY
 */

function hideElements() {
    $(".signupError").hide();
    $(".loginError").hide();
    $(".summarizeError").hide();
}

function loggedInFeatures() {
    $("#logoutButton").show();
    $("#redirSignupButton").hide();
    $("#redirLoginButton").hide();
    $("#save").show();
}

function loggedOutFeatures() {
    $("#logoutButton").hide();
    $("#redirSignupButton").show();
    $("#redirLoginButton").show();
    $("#save").hide();
}

function addButtonListeners() {
    $("#signupButton").on('click', () => {
        // show loading icon
        $("#signupButton").toggleClass('is-loading');
        // revert icon color on each button click
        $(".fa-id-badge").css("color", "#009fff");

        setTimeout(()=> {
            newAccount();
            // synchoronize removal of loading icon and newAccount
            $("#signupButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#loginButton").on('click', () => {
        $("#loginButton").toggleClass('is-loading');
        $(".fa-id-badge, .fa-lock").css("color", "#009fff");

        setTimeout(()=> {
            postLogin();
            $("#loginButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#logoutButton").on('click', () => {
        $("#logoutButton").toggleClass('is-loading');

        setTimeout(()=> {
            logout();
            $("#logoutButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirSignupButton").on('click', () => {
        $("#redirSignupButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "signup.html";
            $("#redirSignupButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirLoginButton").on('click', () => {
        $("#redirLoginButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "login.html" ;
            $("#redirLoginButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirGithubButton").on('click', () => {
        $("#redirGithubButton").toggleClass('is-loading');

        setTimeout(()=> {
            window.location.href = "https://github.com/adamalston/Summarizer";
            $("#redirGithubButton").removeClass('is-loading');
        }, 250);
    });

    $("#summarizeButton").on('click', () => {
        
        $("#summarizeButton").toggleClass('is-loading');

        setTimeout(()=> {
            $("#summarizeButton").removeClass('is-loading');
            // add an async method to get the summary
            summarize();
        }, 250);
    });

//     $("#saveSmmryButton").on('click', () => {
//         saveSmmry();
//     });

    $("#deleteAccountButton").on('click', () => {
        $("#deleteAccountButton").toggleClass('is-loading');

        setTimeout(()=> {
            deleteAccount();
            $("#deleteAccountButton").removeClass('is-loading');
        }, 250);
    });

    $(".navbar-burger").on('click', () => {
        // Toggle is-active class on both the navbar-burger and the navbar-menu
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
}

const accountRoot = axios.create({
    baseURL: "http://localhost:3000/account"
});

async function newAccount() {
    try {
        const result = await accountRoot.post(`/create`,{
        "name": $("#newName").val(),
        "pass": $("#newPass").val(),
        "data": {
            "firstname": $("#firstname").val(),
            "lastname": $("#lastname").val(),
        }
    });
        window.location.replace("login.html");
    } catch (error) {
        $(".signupError").show();
        // change icon color to red indicating error in field
        $(".fa-id-badge").css("color", "red");
    }
}

async function postLogin() {
    try {
        const result = await accountRoot.post(`/login`,{
            "name": $("#name").val(),
            "pass": $("#pass").val(),
        });
        let jwt = result.data.jwt;
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user',result.data.name);
        window.location.replace("index.html");
    } catch (error) {
        $(".loginError").show();
        $(".fa-id-badge, .fa-lock").css("color", "red");
    }
        
//     let result = axios.post('http://localhost:3000/account/login', {
//         "name": $("#name").val(),
//         "pass": $("#pass").val(),
//     });

//     result.then(response => {
//         // console.log("we're in")
//         $("#signupButton").hide();
//         $("#loginButton").hide();
//         let jwt = response.data.jwt;
//         localStorage.setItem('jwt', jwt);
//         localStorage.setItem('user', response.data.name);
//         window.location.replace("index.html");
//     }).catch(error => {
//         $(".loginError").show();
//         $(".fa-id-badge, .fa-lock").css("color", "red");
//     });
}

// function saveSmmry() {
//     try {
//         const result = await accountRoot.post(`/user`,{

//         });
//     } catch (error) {

//     }
// }

function deleteAccount() {
    try {
        let jwt = localStorage.getItem("jwt");
        if (localStorage.getItem("jwt") != null) {
            const result = accountRoot.get(`/status`,{
                headers: {
                    Authorization: "Bearer " + jwt,
                },
            });
            console.log(result);
        }
//         const result = await accountRoot.delete(`/:username`,{

//         });
    //     if (localStorage.getItem("jwt") != null) {
    //         localStorage.removeItem("jwt");
    //         window.location.replace("signup.html");
    //     }
    } catch (error) {
        console.log("error");
    }
}

async function checkStatus() {
    let jwt = localStorage.getItem("jwt");
    if (localStorage.getItem("jwt") != null) {
        const result = await accountRoot.get(`/status`,{
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }); 
        console.log(result.data.user.name);
        return true;
    } else {
        return false;
    }
}

function logout() {
    if (localStorage.getItem("jwt") != null) {
        localStorage.removeItem("jwt");
        window.location.replace("login.html");
    }
}

const smmryRoot = axios.create({
    baseURL: "http://localhost:3000/smmry"
});

async function summarize() {
    let url = $("#url").val();
    $("#url").val('');
    const res = await smmryRoot.post(`/id`, {
        "url": url,
    });
    let id = res.data;
    
    let testerFun = async function(id) {
        try {
            //console.log("testerFun id: ", id);
            const result = await smmryRoot.post(`/getID`, {
                "id": id,
            });	
            console.log(result.data.data);
            let smmryObj = result.data.data;
            let title = smmryObj.data.sm_api_title;
            let body = smmryObj.data.sm_api_content;
            let url = smmryObj.url;

            document.getElementById("title").innerHTML = `${title}`;
            document.getElementById("content").innerHTML = `${body}`;
            console.log("success");
        } catch (error) {
            console.log("error");
            setTimeout(testerFun, 1000, id);  
        }
    }
    setTimeout(testerFun, 1000, id); 
}

// async function getSummaryObject(id) {
//     return await smmryRoot.get(`id.${id}`)
// }



let blinker = document.getElementById('blink');
if (blinker != null) {
    setInterval(function() {
        blinker.style.display = (blinker.style.display == 'none' ? '' : 'none');
    }, 1000);
}

$(document).ready(() => {
    hideElements();
    addButtonListeners();

    if (checkStatus()) {
        loggedInFeatures();
    } else {
        loggedOutFeatures();
    }
});

// --fixed
// back button not working
// check status when someone logged in show buttons
// make logout dissapear when not logged in
// separate view source from signup and login

// --todo

// api data
// {"sm_api_character_count":"546","sm_api_content_reduced":"91%","sm_api_title":"Keyboard class action lawsuit against Apple should succeed",
// "sm_api_content":"Scarcely a month goes by without a new class action lawsuit against Apple. The vast majority of them are frivolous, often absurd,
// but there is one that deserves to succeed: the keyboard class action lawsuit over the failed butterfly design. The butterfly keyboard class action
// lawsuit hinges on two claims. Clearly if Apple had known the likely scale of the problem, it would never have included the butterfly keyboard in
// the machine. As a minimum, Apple should continue to offer free keyboard replacements for the reasonable expected life of the machine.",
// "sm_api_limitation":"Waited 0 extra seconds due to API Free mode, 70 requests left to make for today."}
