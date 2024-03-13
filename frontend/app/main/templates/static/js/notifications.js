function addNotify(msg, id, func_name) {
    alert("addNotify: " + msg + " " + id + " " + func_name);
    let notification = document.getElementById("notify-list");

    let div = document.createElement("div");
    div.classList.add("toast-body", "border-top", "me-2");
    div.id = id;
    div.textContent = msg;
    notification.appendChild(div);

    let div2 = document.createElement("div");
    div2.classList.add("mt-2", "pt-2");
    div.appendChild(div2);

    let button = document.createElement("button");
    button.classList.add("btn", "btn-success", "btn-sm");
    button.setAttribute("onclick", func_name + `(\'accept\', '${id}')`);
    button.textContent = "Accept";
    div2.appendChild(button);

    let button2 = document.createElement("button");
    button2.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    button2.setAttribute("onclick", func_name + `(\'delete\', '${id}')`);
    button2.textContent = "Cancel";
    div2.appendChild(button2);
}

function removeNotify(code) {
    console.log("code", code);
    let notification = document.getElementById(code);
    console.log("REMOVE REMOVE NOTIFY: ", notification);
    notification.remove();
}

function responseTournament(response, code) {
    let method = "POST";
    let access_token = JSON.parse(localStorage.getItem(0)).access_token;
    if (response == "delete") method = "DELETE";

    console.log(response, "....", code);
    fetch(`http://localhost/api/tournaments/invitations/${code}/${response}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        method: method,
    }).then((responseCode) => {
        if (responseCode == 404) alert("Invatation not found");
    });
    removeNotify(code);
}

function responseFriend(response, code) {
    let method = "POST";
    let access_token = JSON.parse(localStorage.getItem(0)).access_token;
    if (response == "delete") method = "DELETE";

    fetch(`http://localhost/api/interacts/invitations/${code}/${response}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
        },
        method: method,
    }).then((responseCode) => {
        if (responseCode == 404) alert("Invatation not found");
    });
    console.log("removeNotify: ", response, "....", code);
    removeNotify(code);
}
