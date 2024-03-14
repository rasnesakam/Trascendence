function sendMessage(sendType, sendText, targetUser) {
    let li = document.createElement("li");
    li.classList.add("clearfix");

    var div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(sendType);
    if (sendType == "other-message")
        div.classList.add("float-right");
    div.textContent = sendText;
    li.appendChild(div);

    document.getElementById("all-message").appendChild(li);
    let messages = JSON.parse(localStorage.getItem("messages"));
    let msg;
    msg = {
        message: sendText,
        from: targetUser,
    };
    if (messages == undefined)
        messages = [msg];
    else
        messages.push(msg);
    console.log("sendMessage is: ", sendText);
    localStorage.setItem("messages", JSON.stringify(messages));

    document.getElementById("message-input").value = "";
}

function clearMessages() {
    document.getElementById("all-message").innerHTML = "";
}

function disableChat() {
    document
        .getElementById("contact-selected-profile-photo")
        .setAttribute(
            "src",
            "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708365600&semt=ais"
        );
    document.getElementById("contact-selected-profile-name").innerHTML = "";
    document.getElementById("message-input").style.display = "none";
    document.getElementById("chat").style.display = "none";
}

function showMessage(type, message) {
    clearMessages();
    for (j = 0; j < Object.keys(people[i].messages).length; j++) {
        sendMessage(type, message);
    }
}

function fetchMessages(from) {
    let token = JSON.parse(localStorage.getItem(0)).access_token
    let request = {
        token,
        type: "fetch-message",
        target: from,
        amount: 20
    }
    socket.send(JSON.stringify(request))
}

function selectedPerson(id) {
    //zamana göre mesajları gösterme

    let people = JSON.parse(localStorage.getItem("contant"))
    clearMessages();
    fetchMessages(id);

    document.getElementById("contact-selected-profile-photo").style.display = "none";
    document.getElementById("message-input").style.display = "block";
    let formElement = document.getElementsByClassName("livechat-send-message")[0]
    let hiddenInput = formElement.querySelector('input[name="to"]')
    hiddenInput.type = "hidden"
    hiddenInput.setAttribute("name", "to")
    hiddenInput.value = id
    let user;
    for (i = 0; i < people.length; i++) {
        document.getElementById(people[i].id).classList.remove("active");
        if (people[i].id == id)
            user = people[i]
    }
    document.getElementById(id).classList.add("active");
    document
        .getElementById("contact-selected-profile-photo")
        .setAttribute("src", user.avatarURI);
    document.getElementById("contact-selected-profile-name").textContent = user.name;

}



async function loadContent() {
    let contact = document.getElementById("add-contacts");

    contact.innerHTML = " ";
    token = JSON.parse(localStorage.getItem(0)).access_token
    console.log(token);
    const { length, content: people } = await fetch("http://localhost/api/interacts/friends", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        return response.json();
    }).catch((error) => console.log(error));
    console.log(people);
    localStorage.setItem("contant", JSON.stringify(people));
    for (let i = 0; i < length; i++) {
        let user = people[i]
        let listItem = document.createElement("li");
        listItem.id = user.id;
        listItem.classList.add("contact", "clearfix");
        contact.appendChild(listItem);

        let img = document.createElement("img");
        img.id = "profile-img";
        img.src = user.avatarURI;
        img.alt = "avatar";
        listItem.appendChild(img);

        // <div class="about"> öğesini oluştur
        let aboutDiv = document.createElement("div");
        aboutDiv.classList.add("about");

        // <div class="name"> öğesini oluştur
        let nameDiv = document.createElement("div");
        // nameDiv.style.marginTop = 5 + "px";
        // nameDiv.style.marginBottom = 5 + "px";
        nameDiv.classList.add("name");
        nameDiv.textContent = user.username;
        aboutDiv.appendChild(nameDiv);

        // <div class="status"> öğesini oluştur
        let statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        nameDiv.appendChild(statusDiv);

        listItem.onclick = () => selectedPerson(user.id)
        listItem.appendChild(aboutDiv);
        // <i class="fa fa-circle offline"></i> öğesini oluştur
        let circleIcon = document.createElement("i");
        circleIcon.classList.add("fa", "fa-circle");
        // TODO: Send ping 
        let lastPing = 0
        setInterval(() => {
            if (Date.now() - lastPing > 2000){
                circleIcon.classList.remove("online");
                circleIcon.classList.add("offline");
            }
            socket.send(JSON.stringify({
                type: "ping",
                to: user.id
            }))
        }, 1000)
        socket.addEventListener("message", (message) => {
            jsonObj = JSON.parse(message.data)
            if (jsonObj.type == "pong" && jsonObj.from == user.id) {
                circleIcon.classList.remove("offline");
                circleIcon.classList.add("online");
                lastPing = Date.now()
            }
        });
        
        circleIcon.classList.add("offline");
        statusDiv.appendChild(circleIcon);
        contact.innerHTML += listItem.outerHTML
    }
}

loadContent();


var messagesElement = document.querySelector(".messages");
if (messagesElement) {
    messagesElement.scrollTop = document.body.scrollHeight;
}

//document.getElementById("profile-img").addEventListener("click", function () {
//    document.querySelector("#status-options").classList.toggle("active");
//});

Array.from(document.querySelectorAll(".expand-button")).forEach(function (
    element
) {
    element.addEventListener("click", function () {
        document.querySelector("#profile").classList.toggle("expanded");
        document.querySelector("#contacts").classList.toggle("expanded");
    });
});

Array.from(document.querySelectorAll("#status-options   i")).forEach(
    function (element) {
        element.addEventListener("click", function () {
            document.querySelector("#profile-img").className = "";
            Array.from(document.querySelectorAll("#status-options ul li")).forEach(
                function (innerElement) {
                    innerElement.classList.remove("active");
                }
            );
            this.classList.add("active");

            if (
                document.querySelector("#status-online").classList.contains("active")
            ) {
                document.querySelector("#profile-img").classList.add("online");
            } else if (
                document.querySelector("#status-away").classList.contains("active")
            ) {
                document.querySelector("#profile-img").classList.add("away");
            } else if (
                document.querySelector("#status-busy").classList.contains("active")
            ) {
                document.querySelector("#profile-img").classList.add("busy");
            } else if (
                document.querySelector("#status-offline").classList.contains("active")
            ) {
                document.querySelector("#profile-img").classList.add("offline");
            } else {
                document.querySelector("#profile-img").className = "";
            }

            document.querySelector("#status-options").classList.remove("active");
        });
    }
);

const searchAlgorithm = () => {
    var search = document.querySelector("#search input").value;
    fetch(`http://localhost/api/users/search/${search}`)
        .then(data => data.json())
        .then(datas => {
            console.log(datas)
            let contacts = document.getElementById("add-contacts")
            contacts.innerHTML = ""
            for (let i = 0; i < datas.length; i++) {
                let user = datas.content[i];
                let element = `
            <li id="${user.id}" class="clearfix" onclick="selectedPerson('${user.id}')">
                <img id="profile-img" src="${user.avatarURI}" alt="avatar" />
                <div class="about">
                <div class="name">${user.name}</div>
                <div class="status">
                    <i class="fa fa-circle online"></i> offline
                </div>
                </div>
            </li>
            `;
                contacts.innerHTML += element
            }
        });
};


(function () {
    console.log("adding event listener to form");
    let form = document.getElementsByClassName("livechat-send-message")[0];
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        let targetUser = formData.get("to");
        console.log(targetUser);

        console.log("target: ", targetUser.id);
        sendMessage("my-message", formData.get("content"), targetUser);
        socket.send(JSON.stringify({ type: "message", message: formData.get("content"), to: targetUser }))
    })
})();

let user_data = JSON.parse(localStorage.getItem(0)).user
socket.addEventListener('message', (message) => {
    let jsonObj = JSON.parse(message.data);
    if (jsonObj.type == "message")
        sendMessage(jsonObj.from == user_data.id ? "my-message" : "other-message", jsonObj.message, jsonObj.from);
})