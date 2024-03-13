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

    console.log("Hello world btekinli")
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

function submitSend()
{
    let name = document.getElementById("contact-selected-profile-name").value;

}

function showMessage(type, message)
{
    clearMessages();
    for (j = 0; j < Object.keys(people[i].messages).length; j++) {
        sendMessage(type, message);   
    }
}

function selectedPerson(name) {
    //zamana göre mesajları gösterme
    let people = JSON.parse(localStorage.getItem("contant"))
    console.log(name);
    clearMessages();
    document.getElementById("message-input").style.display = "block";
    // load previous messages
    for (i = 0; i < people.length; i++) {
        if (people[i].username == name) {
            document.getElementById(people[i].username).classList.add("active");
            document
                .getElementById("contact-selected-profile-photo")
                .setAttribute("src", people[i].avatarURI);
            document.getElementById("contact-selected-profile-name").textContent =
                people[i].name;
             
            /*for (j = 0; j < Object.keys(people[i].messages).length; j++) {
                showMessage(
                    people[i].messages[j].type,
                    people[i].messages[j].message
                );
            }*/
            
            
        } else {
            document.getElementById(name).classList.remove("active");
        }
    }
    
}



async function loadContent() {
    var contact = document.getElementById("add-contacts");

    contact.innerHTML = " ";
    token = JSON.parse(localStorage.getItem(0)).access_token
    console.log(token);
    const {length, content:people} = await fetch("http://localhost/api/interacts/friends", {
        method: "GET",
        headers:{
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        return response.json();
    }).catch((error) => console.log(error));
    console.log(people)
    localStorage.setItem("contant", JSON.stringify(people));
    for (var i = 0; i < length; i++) {
        let user = people[i]
        var listItem = document.createElement("li");
        listItem.id = user.username;
        listItem.classList.add("contact");
        listItem.classList.add("active");
        contact.appendChild(listItem);
       
        var img = document.createElement("img");
        img.id = "profile-img";
        img.src = user.avatarURI;  
        img.alt = "avatar";
        listItem.appendChild(img);

        // <div class="about"> öğesini oluştur
        var aboutDiv = document.createElement("div");
        aboutDiv.classList.add("about");

        // <div class="name"> öğesini oluştur
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.textContent = user.username;
        aboutDiv.appendChild(nameDiv);

        // <div class="status"> öğesini oluştur
        var statusDiv = document.createElement("div");
        statusDiv.classList.add("status");
        nameDiv.appendChild(statusDiv);

        listItem.onclick = () => selectedPerson(user.username)
        listItem.appendChild(aboutDiv);
        // <i class="fa fa-circle offline"></i> öğesini oluştur
        var circleIcon = document.createElement("i");
        circleIcon.classList.add("fa", "fa-circle");
        circleIcon.classList.add("offline");
        statusDiv.appendChild(circleIcon);
        console.log("list:", listItem);
    }
}

loadContent();

function connectWebSocket() {
    var socket = new WebSocket("ws://localhost:8080");

    // Bağlantı açıldığında
    socket.addEventListener("open", function (event) {
        console.log("WebSocket bağlantısı açıldı.");
    });

    // Mesaj alındığında
    socket.addEventListener("message", function (event) {
        var outputDiv = document.getElementById("output");
        outputDiv.innerHTML += "<p>Received: " + event.data + "</p>";
    });

    // Bağlantı kapandığında
    socket.addEventListener("close", function (event) {
        console.log("WebSocket bağlantısı kapandı.");
    });

    // Hata oluştuğunda
    socket.addEventListener("error", function (event) {
        console.error("WebSocket hatası:", event);
    });

    socket.send;
}



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

Array.from(document.querySelectorAll("#status-options ul li")).forEach(
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
        for (let i = 0; i < datas.length; i++){
            let user = datas.content[i];
            let element = `
            <li id="${user.id}" class="clearfix" onclick="selectedPerson(${user.username})">
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

//const searchAlgorithm = () => {
//    var search = document.querySelector("#search input").value;
    
//    for (var i = 0; i < Object.keys(people).length; i++) {
//        if (people[i].name.toLowerCase().includes(search.toLowerCase())) {
//            document.getElementById(people[i].name).style.display = "block";
//        } else {
//            document.getElementById(people[i].name).style.display = "none";
//        }
//    }
//};

// prototip yap backend hazır olduğunda backendden alıp
//göster

/*
//profile-detail.js
function setRate(win, lose, elementId) {
  var matchesCount = win + lose;
  var winsCount = win;
  var data = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [matchesCount, winsCount],
        backgroundColor: ["#C60606", "#20C606"],
      },
    ],
  };
  var ctx = document.getElementById(elementId).getContext("2d");
  Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
  return myPieChart;
}*/

/*(function () {
  setRate(37, 63, "myPieChart");
  setRate(2, 1, "myPieChart2");
})();
*/


var user_data = JSON.parse(localStorage.getItem(0));
console.log(user_data)
var socket_url = `ws://localhost/ws/socket-server/${user_data.user.username}`

var socket = new WebSocket(socket_url)
var socket_sent = {token: user_data.access_token, type: "new_message", message: "selam", to:user_data.user.username}

socket.onopen = () => socket.send(JSON.stringify(socket_sent)) 

socket.onmessage = (message) => {
    console.log(message)
    let jsonObj = JSON.parse(message.data);
    sendMessage("other-message", jsonObj.message, jsonObj.from);
}

(function(){
    console.log("adding event listener to form");
    let form = document.getElementsByClassName("livechat-send-message")[0]
    form.addEventListener("submit", function(e){
        e.preventDefault();
        let formData = new FormData(e.target);
        let targetUser = document.querySelector("#add-contacts").querySelector(".active")
        console.log("target: ", targetUser.id);
        sendMessage("my-message", formData.get("content"), targetUser.id);
        console.log(targetUser)
        socket.send(JSON.stringify({type:"message", message:formData.get("content"), to: targetUser.id}))
    })
})();
