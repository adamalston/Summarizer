// api key 9720744B0C
/**
 * How to make an API request to SMMRY
 */

function hideElements() {
    $(".signupError").hide();
    $(".loginError").hide();
    $(".summarizeError").hide();
}

function loggedInFeatures() {
    $("#logoutButton").show();
    $("#redirSignupButton").hide();
    $("#redirLoginButton").hide();
    $("#saveSmmryButton").show();
    $("#deleteAccountButton").show();
    $("#notesSection").show();
    $("#saveSection").show();
}

function loggedOutFeatures() {
    $("#logoutButton").hide();
    $("#redirSignupButton").show();
    $("#redirLoginButton").show();
    $("#saveSmmryButton").hide();
    $("#deleteAccountButton").hide();
    $("#notesSection").hide();
    $("#saveSection").hide();
}

function addButtonListeners() {
    $("#signupButton").on('click', () => {
        // show loading icon
        $("#signupButton").toggleClass('is-loading');
        // revert icon color on each button click
        $(".fa-id-badge").css("color", "#009fff");

        setTimeout(() => {
            newAccount();
            // synchoronize removal of loading icon and newAccount
            $("#signupButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#loginButton").on('click', () => {
        $("#loginButton").toggleClass('is-loading');
        $(".fa-id-badge, .fa-lock").css("color", "#009fff");

        setTimeout(() => {
            postLogin();
            $("#loginButton").removeClass('is-loading');
        }, 250);

        hideElements();
    });

    $("#logoutButton").on('click', () => {
        $("#logoutButton").toggleClass('is-loading');

        setTimeout(() => {
            logout();
            $("#logoutButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirSignupButton").on('click', () => {
        $("#redirSignupButton").toggleClass('is-loading');

        setTimeout(() => {
            window.location.href = "signup.html";
            $("#redirSignupButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirLoginButton").on('click', () => {
        $("#redirLoginButton").toggleClass('is-loading');

        setTimeout(() => {
            window.location.href = "login.html";
            $("#redirLoginButton").removeClass('is-loading');
        }, 250);
    });

    $("#redirGithubButton").on('click', () => {
        $("#redirGithubButton").toggleClass('is-loading');

        setTimeout(() => {
            window.location.href = "https://github.com/adamalston/Summarizer";
            $("#redirGithubButton").removeClass('is-loading');
        }, 250);
    });

    $("#summarizeButton").on('click', () => {

        $("#summarizeButton").toggleClass('is-loading');

        setTimeout(() => {
            $("#summarizeButton").removeClass('is-loading');
            summarize();
        }, 250);
    });

    //     $("#saveSmmryButton").on('click', () => {
    //         saveSmmry();
    //     });

    $("#deleteAccountButton").on('click', () => {
        $("#deleteAccountButton").toggleClass('is-loading');

        setTimeout(() => {
            deleteAccount();
            $("#deleteAccountButton").removeClass('is-loading');
        }, 250);
    });

    $(".navbar-burger").on('click', () => {
        // Toggle is-active class on both the navbar-burger and the navbar-menu
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });
}

const accountRoot = axios.create({
    baseURL: "http://localhost:3000/account"
});

async function newAccount() {
    try {
        const result = await accountRoot.post(`/create`, {
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
        // change icon color to red indicating error in field
        $(".fa-id-badge").css("color", "red");
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
}

// function saveSmmry() {
//     try {
//         const result = await accountRoot.post(`/user`,{

//         });
//     } catch (error) {

//     }
// }

async function deleteAccount() {
    try {
        let username = await checkStatus();
        console.log(username);
        if (username === undefined) {
            throw "Username is undefined";
        } else {
            const res = await accountRoot.delete(`/${username}`);
            localStorage.removeItem("jwt");
            window.location.replace("signup.html");
        }
    } catch (error) {
        console.log(error);
    }
}

async function checkStatus() {
    let jwt = localStorage.getItem("jwt");
    if (localStorage.getItem("jwt") != null) {
        const result = await accountRoot.get(`/status`,{
            headers: {
                Authorization: "Bearer " + jwt,
            },
        }); 
        return result.data.user.name;
    } else {
        return undefined;
    }
}

function logout() {
    if (localStorage.getItem("jwt") != null) {
        localStorage.removeItem("jwt");
        window.location.replace("login.html");
    }
}

const smmryRoot = axios.create({
    baseURL: "http://localhost:3000/smmry"
});

async function summarize() {
    let url = $("#url").val();
    $("#url").val('');
    const res = await smmryRoot.post(`/id`, {
        "url": url,
    });
    let id = res.data;

    let testerFun = async function (id) {
        try {
            let smmryObj = await getSummaryObject(id);
            let title = smmryObj.data.sm_api_title;
            let body = smmryObj.data.sm_api_content;
            let url = smmryObj.url;
            populateMain(smmryObj);

            console.log("success");
        } catch (error) {
            console.log("error");
            setTimeout(testerFun, 1000, id);
        }
    }
    setTimeout(testerFun, 1000, id);
}

async function getSummaryObject(id) {
    const result = await smmryRoot.post(`/getID`, {
        "id": id,
    });
    let obj = result.data.data;
    return obj;
}

function populateMain(object) {
    let smmry = object;
    let title = smmry.data.sm_api_title;
    let content = smmry.data.sm_api_content;
    let source = smmry.url;
    let notes = '';

    let smmryMarkup =
    `
    <div class="content" id="mainContent">
        <h4 class="has-text-centered" id="title">${title}</h4>
        <p id="content">${content}</p>
        <p><a href="${source}" id="source">${source}</a></p>
        <p>Notes: ${notes}<p>
    </div>
    `;
    $("#mainContent").remove();
    $("#mainCard").append($(smmryMarkup));
}

// async function populateSecondaries(store) {

// }



let blinker = document.getElementById('blink');
if (blinker != null) {
    setInterval(function () {
        blinker.style.display = (blinker.style.display == 'none' ? '' : 'none');
    }, 1000);
}

$(document).ready(async () => {
    hideElements();
    addButtonListeners();
    let username = await checkStatus();

    if (username != undefined) {
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
// create functions to populate main (done) and secondary SMMRY cards (not done)
// when adding to userStore, add note functionality
// fix the summarizeError

// api data
// {"sm_api_character_count":"546","sm_api_content_reduced":"91%","sm_api_title":"Keyboard class action lawsuit against Apple should succeed",
// "sm_api_content":"Scarcely a month goes by without a new class action lawsuit against Apple. The vast majority of them are frivolous, often absurd,
// but there is one that deserves to succeed: the keyboard class action lawsuit over the failed butterfly design. The butterfly keyboard class action
// lawsuit hinges on two claims. Clearly if Apple had known the likely scale of the problem, it would never have included the butterfly keyboard in
// the machine. As a minimum, Apple should continue to offer free keyboard replacements for the reasonable expected life of the machine.",
// "sm_api_limitation":"Waited 0 extra seconds due to API Free mode, 70 requests left to make for today."}
