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
    // $("#saveSmmryButton").show();
    $("#deleteAccountButton").show();
    $("#notesSection").show();
    $("#secondaryButtons").show();
    // $("#saveSection").show();
}

function loggedOutFeatures() {
    $("#logoutButton").hide();
    $("#redirSignupButton").show();
    $("#redirLoginButton").show();
    // $("#saveSmmryButton").hide();
    $("#deleteAccountButton").hide();
    $("#notesSection").hide();
    $("#secondaryButtons").hide();
    // $("#saveSection").hide();
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

    // $("#saveSmmryButton").on('click', () => {
    //     saveSmmry();
    // });

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

    $("#attachNoteButton").on('click', () => {
        $("#attachNoteButton").toggleClass('is-loading');

        setTimeout(() => {
            attachNote();
            $("#attachNoteButton").removeClass('is-loading');
        }, 250);
    });

    $("#userSummaries").on('click', () => {
        $("#userSummaries").toggleClass('is-loading');
        $("userSummaries").hide();
        $("privateSummaries").show();

        setTimeout(async () => {
            let username = await checkStatus();
            populateMain(username);
            $("#userSummaries").removeClass('is-loading');
        }, 250);
    });

    $("#privateSummaries").on('click', () => {
        $("#privateSummaries").toggleClass('is-loading');
        $("userSummaries").show();
        $("privateSummaries").hide();
        setTimeout(async () => {
            let username = await checkStatus();
            populatePrivate(username);
            $("#privateSummaries").removeClass('is-loading');
        }, 250);
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

async function postLogin() {
    try {
        const result = await accountRoot.post(`/login`, {
            "name": $("#name").val(),
            "pass": $("#pass").val(),
        });
        let jwt = result.data.jwt;
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', result.data.name);
        window.location.replace("index.html");
    } catch (error) {
        $(".loginError").show();
        $(".fa-id-badge, .fa-lock").css("color", "red");
    }
}

// async function saveSmmry() {
//     try {

//         let jwt = localStorage.getItem("jwt");
//         let res = await userRoot.post('/ids',
//             {
//                 "data": [`${id}`],
//                 "type": "merge",
//             },
//             {
//                 headers: {
//                     Authorization: "Bearer " + jwt,
//                 }
//             }
//         );
//     } catch (error) {

//     }
// }

async function deleteAccount() {
    try {
        let username = await checkStatus();
        console.log(username);
        if (username === undefined) {
            throw "Username is undefined";
        } else {
            const res = await accountRoot.delete(`/${username}`);
            localStorage.removeItem("jwt");
            window.location.replace("signup.html");
        }
    } catch (error) {
        console.log(error);
    }
}

async function checkStatus() {
    let jwt = localStorage.getItem("jwt");
    if (localStorage.getItem("jwt") != null) {
        const result = await accountRoot.get(`/status`, {
            headers: {
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
    let id = res.data.data;
    // console.log(id);

    let testerFun = async function (id) {
        try {
            let smmryObj = await getSummaryObject(id);
            if (smmryObj === undefined) throw "smmryObj undefined";
            let title = smmryObj.data.sm_api_title;
            let body = smmryObj.data.sm_api_content;
            let url = smmryObj.url;
            let username = await checkStatus();
            if (username === undefined) {
                let res = await publicRoot.post('/ids', {
                    "data": `${id}`,
                    "type": "merge"
                });
            } else {
                let jwt = localStorage.getItem("jwt");
                let res = await privateRoot.post('/ids',
                    {
                        "data": `${id}`,
                        "type": "merge",
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + jwt,
                        }
                    }
                );
                console.log(res);
                res = await userRoot.post(`/ids`,
                    {
                        "data": [{
                            "data": `${id}`,
                            "notes": "",
                        }],
                        "type": "merge",
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + jwt,
                        }
                    }
                );
                console.log(res);

            }
        } catch (error) {
            console.log("testerfun loop, or possible error");
            if (error == 'smmryObj undefined') {
                setTimeout(testerFun, 1000, id);
            }
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

async function attachNote() {
    let addNote = $("#note").val();
    $("#note").val('');
    let id = $("#attachNoteButton").val();
    let jwt = localStorage.getItem("jwt");
    let arr = await userRoot.get(`/ids`,
        {
            headers: {
                Authorization: "Bearer " + jwt,
            }
        }
    );
    arr = arr.data.result;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].data == id) {
            arr[i].notes = addNote;
        }
    }
    const result = await userRoot.post(`/ids`,
        {
            "data": arr
        },
        {
            headers: {
                Authorization: "Bearer " + jwt,
            }
        }
    );
}

// async postToStore

async function populateMain(username) {
    let smmry, obj, notes;
    if (username === undefined) {
        const result = await publicRoot.get('/ids');
        let ids = result.data.result;
        let index = Math.floor((Math.random() * (ids.length)));
        obj = ids;
        notes = undefined;
        console.log(ids);
        smmry = await getSummaryObject(ids[index]);
    } else {
        let jwt = localStorage.getItem("jwt");
        const result = await userRoot.get(`/ids`, {
            headers: {
                Authorization: "Bearer " + jwt,
            },
        });
        console.log(result);
        obj = result.data.result;

        console.log(obj);
        let id = obj[obj.length - 1].data;
        notes = obj[obj.length - 1].notes;
        console.log(notes);
        $('#attachNoteButton').val(`${id}`);
        smmry = await getSummaryObject(id);
    }
    if (notes === undefined) {
        notes = '';
    } else {
        notes = "User Note: " + notes;
    }
    let title = smmry.data.sm_api_title;
    let content = smmry.data.sm_api_content;
    let source = smmry.url;
    let smmryMarkup = `
        <div class="content" id="mainContent">
            <h4 class="has-text-centered" id="title">${title}</h4>
            <p id="content">${content}</p>
            <p><a href="${source}" id="source">${source}</a></p>
            <p>${notes}</p>
        </div>`;
    $("#mainContent").remove();
    $("#mainCard").append($(smmryMarkup));
    populateSecondaries(obj);
}

async function populatePrivate(username) {
    let secondaryMarkup = (title, source, link, id) => {
        return `
        <div class="column is-4 secondaries">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <h4 id="title">${title}</h4>
                        <p><a id="source" href="${source}">${link}</a></p>
                        <div class="control">
                            <a class="button" id="${id}">View</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }
    $(".secondaries").remove();
    let jwt = localStorage.getItem("jwt");
    let result = await privateRoot.get('/ids',
        {
            headers: {
                Authorization: "Bearer " + jwt,
            }
        }
    );
    let array = result.data.result;

    console.log(array);

    for (let i = array.length - 1; i >= 0; i--) {
        let userObj = array[i];
        let smmry = await getSummaryObject(userObj);
        let title = smmry.data.sm_api_title;
        let content = smmry.data.sm_api_content;
        let source = smmry.url;
        let link = source.split('/')[0];
        $("#mainColumn").append($(secondaryMarkup(title, source, link, userObj)));

    }
    for (let i = array.length - 1; i >= 0; i--) {
        let userObj = array[i];
        let smmry = await getSummaryObject(userObj);
        let title = smmry.data.sm_api_title;
        let content = smmry.data.sm_api_content;
        let source = smmry.url;
        $(`#${userObj}`).on('click', () => {
            let smmryMarkup = `
                <div class="content" id="mainContent">
                    <h4 class="has-text-centered" id="title">${title}</h4>
                    <p id="content">${content}</p>
                    <p><a href="${source}" id="source">${source}</a></p>
                </div>`;
            $("#attachNoteButton").val(`${userObj}`);
            $("#mainContent").remove();
            $("#mainCard").append($(smmryMarkup));
        });
    }
}

async function populateSecondaries(array) {
    console.log(array);
    let secondaryMarkup = (title, source, link, notes, id) => {
        if (notes != '') {
            notes = `User Note: <br>${notes}`;
        } else {
            notes = '';
        }
        return `
        <div class="column is-4 secondaries">
            <div class="card">
                <div class="card-content">
                    <div class="content">
                        <h4 id="title">${title}</h4>
                        <p><a id="source" href="${source}">${link}</a></p>
                        <p>${notes}</p>
                        <div class="control">
                            <a class="button" id="${id}">View</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    }
    $(".secondaries").remove();

    for (let i = array.length - 1; i >= 0; i--) {
        let notes, id, smmry;
        let userObj = array[i];
        if (userObj.notes === undefined) {
            notes = '';
            id = userObj;
            smmry = await getSummaryObject(userObj);
        } else {
            id = userObj.data;
            smmry = await getSummaryObject(userObj.data);
            notes = userObj.notes;
        }
        console.log(notes);
        let title = smmry.data.sm_api_title;
        let content = smmry.data.sm_api_content;
        let source = smmry.url;
        let link = source.split('/')[0];
        $("#mainColumn").append($(secondaryMarkup(title, source, link, notes, id)));

    }
    for (let i = array.length - 1; i >= 0; i--) {
        let notes, id, smmry;
        let userObj = array[i];
        if (userObj.notes === undefined) {
            notes = '';
            id = userObj;
            smmry = await getSummaryObject(userObj);
        } else {
            id = userObj.data;
            smmry = await getSummaryObject(userObj.data);
            if (userObj.notes == '') {
                notes = userObj.notes;
            } else {
                notes = "User Note: " + userObj.notes;
            }
        }
        console.log(notes);
        let title = smmry.data.sm_api_title;
        let content = smmry.data.sm_api_content;
        let source = smmry.url;
        $(`#${id}`).on('click', () => {
            let smmryMarkup = `
                <div class="content" id="mainContent">
                    <h4 class="has-text-centered" id="title">${title}</h4>
                    <p id="content">${content}</p>
                    <p><a href="${source}" id="source">${source}</a></p>
                    <p>${notes}</p>
                </div>`;
            $("#attachNoteButton").val(`${id}`);
            $("#mainContent").remove();
            $("#mainCard").append($(smmryMarkup));
        });
    }
}

const publicRoot = axios.create({
    baseURL: "http://localhost:3000/public"
});

const privateRoot = axios.create({
    baseURL: "http://localhost:3000/private"
});

const userRoot = axios.create({
    baseURL: "http://localhost:3000/user"
});

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
    populateMain(username);
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
