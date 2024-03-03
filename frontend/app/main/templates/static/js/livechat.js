people = {
    0: {
        name: "vporter",
        messages: [
            {
                message: "Merhaba",
                date: "2021-01-01",
                time: "12:00",
                type: "other-message",
            },
            {
                message:
                    "What are you talking about? You do what they say or they shoot you.",
                date: "2021-01-01",
                time: "13:00",
                type: "my-message",
            },
            {
                message:
                    "What are you talking about? You do what they say or they shoot you.",
                date: "2021-01-01",
                time: "15:00",
                type: "other-message",
            },
            {
                message: "get off",
                date: "2021-01-01",
                time: "17:00",
                type: "other-message",
            },
        ],
        profile_photo: "https://bootdey.com/img/Content/avatar/avatar1.png",
        status: "offile",
    },
    1: {
        name: "achavez",
        messages: [
            {
                message: "Merhaba",
                date: "2021-01-01",
                time: "12:00",
                type: "other-message",
            },
            {
                message: "Merhaba",
                date: "2021-01-01",
                time: "12:00",
                type: "my-message",
            },
        ],
        profile_photo: "https://bootdey.com/img/Content/avatar/avatar2.png",
        status: "online",
    },
    2: {
        name: "mthomas",
        messages: [
            {
                message: "Merhaba",
                date: "2021-01-01",
                time: "12:00",
                type: "my-message",
            },
            {
                message: "Merhaba",
                date: "2021-01-01",
                time: "12:00",
                type: "my-message",
            },
        ],
        profile_photo: "https://bootdey.com/img/Content/avatar/avatar3.png",
        status: "online",
    },
};

function sendMessage(sendType, sendText) {
    var message = document.createElement("li");
    message.classList.add("clearfix");

    var div = document.createElement("div");
    div.classList.add("message");
    div.classList.add(sendType);
    if (sendType == "other-message")
        div.classList.add("float-right");
    div.textContent = sendText;
    message.appendChild(div);

    document.getElementById("all-message").appendChild(message);
    console.log(message);
}

function clearMessages() {
    document.getElementById("all-message").innerHTML = " ";
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

function selectedPerson(name) {
    //zamana göre mesajları gösterme
    console.log(name);
    clearMessages()
    document.getElementById("chat").style.display = "block";
    document.getElementById("message-input").style.display = "block";
    for (i = 0; i < Object.keys(people).length; i++) {
        if (people[i].name == name) {
            document.getElementById(people[i].name).classList.add("active");
            document
                .getElementById("contact-selected-profile-photo")
                .setAttribute("src", people[i].profile_photo);
            document.getElementById("contact-selected-profile-name").innerHTML =
                people[i].name;
            for (j = 0; j < Object.keys(people[i].messages).length; j++) {
                sendMessage(
                    people[i].messages[j].type,
                    people[i].messages[j].message
                );
            }
        } else {
            document.getElementById(people[i].name).classList.remove("active");
        }
    }
}


function loadContent() {
    var contact = document.getElementById("add-contacts");

    contact.innerHTML = " ";
    for (var i = 0; i < Object.keys(people).length; i++) {
        var img = document.createElement("img");
        img.id = "profile-img";
        img.src = "https://bootdey.com/img/Content/avatar/avatar1.png";
        img.alt = "avatar";
        listItem.appendChild(img);

        // <div class="about"> öğesini oluştur
        var aboutDiv = document.createElement("div");
        aboutDiv.classList.add("about");

        // <div class="name"> öğesini oluştur
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.textContent = people[i].name;
        aboutDiv.appendChild(nameDiv);

        // <div class="status"> öğesini oluştur
        var statusDiv = document.createElement("div");
        statusDiv.classList.add("status");

        // <i class="fa fa-circle offline"></i> öğesini oluştur
        var circleIcon = document.createElement("i");
        circleIcon.classList.add("fa", "fa-circle", people);
        statusDiv.appendChild(circleIcon);
        statusDiv.appendChild(document.createTextNode(" offline"));

        aboutDiv.appendChild(statusDiv);

        // <div class="about"> öğesini <li> öğesine ekle
        listItem.appendChild(aboutDiv);

        // Oluşturulan <li> öğesini bir başka elemana ekleyin veya kullanın
        var container = document.getElementById("container"); // Değiştirilecek olan container elemanını seçin
        container.appendChild(listItem); // Oluşturulan <li> öğesini container'a ekleyin
    }
}

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

document.getElementById("profile-img").addEventListener("click", function () {
    document.querySelector("#status-options").classList.toggle("active");
});

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

function newMessage() {
    //mesaj göndermek için
    message = $(".message-input input").val();
    if ($.trim(message) == "") {
        return false;
    }
    $(
        '<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' +
        message +
        "</p></li>"
    ).appendTo($(".messages ul"));
    $(".message-input input").val(null);
    $(".contact.active .preview").html("<span>You: </span>" + message);
    $(".messages").animate({ scrollTop: $(document).height() }, "fast");
}

function searchAlgorithm() {
    var search = document.querySelector("#search input").value;

    for (var i = 0; i < Object.keys(people).length; i++) {
        if (people[i].name.toLowerCase().includes(search.toLowerCase())) {
            document.getElementById(people[i].name).style.display = "block";
        } else {
            document.getElementById(people[i].name).style.display = "none";
        }
    }
};

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