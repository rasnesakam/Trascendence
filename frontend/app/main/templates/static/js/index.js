//İndex.js


var user = {
  id: 1,
  nickname: "ayumusak",
  username: "ayumusak",
  name: "Ahmet Kaan",
  surname: "Yumuşakdiken",
  photo: "static/assets/profile-photos/aydemir.jpg",

  total_time: 120,
  total_tournament: 3,
  total_match: 20,
  enemy: "emakas",
};

const webRoute = {
  404: "/static/pages/error.html",
  "/": "/static/pages/main.html",
  "/about": "/static/pages/about.html",
  "/game": "/static/pages/game.html",
  "/match": "/static/pages/match.html",
  "/profile-detail": "/static/pages/profile-detail.html",
  "/tournament": "/static/pages/tournament.html",
  "/livechat": "/static/pages/livechat.html",
};

function whichEvent(id) {
  if (id == "nav-home") {
    loadUserInformation();
  } else if (id == "nav-livechat") {
    disableChat();
    loadContact();
  }
}

function isPassageEvent(eventId) {
  if (eventId == "nav-home") return true;
  if (eventId == "nav-about") return true;
  if (eventId == "nav-game") return true;
  return false;
}

const router = () => {
  var body = document.body;

  body.addEventListener("click", function (event) {
    if (!isPassageEvent(event.target.id))
      return 0;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    switchPages(event.target.id);
  });
};

const switchPages = async (eventId) => {
  const path = window.location.pathname;
  const route = webRoute[path] || webRoute[404];
  const html = await fetch(route).then((response) => response.text());

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(html, "text/html");

  const xmlHead = xmlDoc.head.innerHTML;
  const xmlBody = xmlDoc.body.innerHTML;
  document.getElementById("index-head").innerHTML = xmlHead;
  document.getElementById("index-body").innerHTML = xmlBody;
  whichEvent(eventId);
};

//main.js
function loadUserInformation() {
  document.getElementById("nickname").innerHTML = user.nickname || "Nickname";
  document.getElementById("pr-name").innerHTML = "Name: " + user.name;
  document.getElementById("pr-surname").innerHTML = "Surname: " + user.surname;
  document.getElementById("profile-photo").src = user.photo;

  document.getElementById("total_time").innerHTML = user.total_time + " Min";
  document.getElementById("total_tournament").innerHTML =
    user.total_tournament + " Tournament";
  document.getElementById("total_match").innerHTML =
    user.total_match + " Match";
  document.getElementById("enemy").innerHTML = user.enemy;
}

function saveUserInformation() {
  user.nickname = document.getElementById("nicknameInput").value;

  alert("file: " + user.photo);
  user.name = document.getElementById("nameInput").value;
  user.surname = document.getElementById("surnameInput").value;
  loadUserInformation();
  closeUpdateProfile();
  alert("oli");
}

function removeSubstring(originalString, substringToRemove) {
  return originalString.replace(substringToRemove, "");
}

const updateProfile = () => {
  document.getElementById("close-icon").style.display = "block";
  document.getElementById("setting-icon").style.display = "none";
  document.getElementById("save-icon").style.display = "block";
  document.getElementById("profile-photo").classList.add("darken-on-hover");
  document.getElementById("nickname").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("surname").style.display = "none";
  document.getElementById("information").style.display = "block";
  document.getElementById("questions").style.display = "block";

  document.getElementById("nicknameInput").value = user.nickname;
  document.getElementById("nameInput").value = user.name;
  document.getElementById("surnameInput").value = user.surname;

  document.getElementById("profile-photo").style.cursor = "pointer";
};

const closeUpdateProfile = () => {
  var profil_photo = document.getElementById("profile-photo");

  document.getElementById("close-icon").style.display = "none";
  document.getElementById("setting-icon").style.display = "block";
  document.getElementById("save-icon").style.display = "none";
  profil_photo.classList.remove("darken-on-hover");
  document.getElementById("nickname").style.display = "block";
  document.getElementById("name").style.display = "block";
  document.getElementById("surname").style.display = "block";
  document.getElementById("information").style.display = "none";
  document.getElementById("questions").style.display = "none";
  profil_photo.style.cursor = "default";
};

const clickOpcity = (section, othSection) => {
  let target = document.getElementById(section);
  let event = document.getElementById("under-" + section);
  let othTarget = document.getElementById(othSection);
  let othEvent = document.getElementById("under-" + othSection);

  target.style.cursor = "default";
  othTarget.style.cursor = "pointer";
  target.style.opacity = 0.6;
  othTarget.style.opacity = 1;
  event.style.display = "block";
  othEvent.style.display = "none";
};

const changePhoto = () => {
  let control = document.getElementById("close-icon").style;
  if (control.display == "block") {
    document.getElementById("fileInput").click();
  }
};

function outLogin()
{
  localStorage.removeItem(0);
  window.location.href = "/login";

}

//livechat.js
people = {
  0: {
    name: "Harvey Specter",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message:
          "What are you talking about? You do what they say or they shoot you.",
        date: "2021-01-01",
        time: "13:00",
        type: "replies",
      },
      {
        message:
          "What are you talking about? You do what they say or they shoot you.",
        date: "2021-01-01",
        time: "15:00",
        type: "sent",
      },
      {
        message: "get off",
        date: "2021-01-01",
        time: "17:00",
        type: "sent",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/harveyspecter.png",
    status: "online",
  },
  1: {
    name: "Charles Forstman",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "replies",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/charlesforstman.png",
    status: "offline",
  },
  2: {
    name: "Jonathan Sidwell",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "replies",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/jonathansidwell.png",
    status: "online",
  },
};

function sendMessage(sendType, photoWho, sendText) {
  var message = document.createElement("li");
  message.classList.add(sendType);

  var img = document.createElement("img");
  img.src = photoWho;
  message.appendChild(img);

  var para = document.createElement("p");
  para.textContent = sendText;
  message.appendChild(para);

  document.getElementById("message").appendChild(message);
  console.log(message);
  document.querySelector(".messages").scrollTop =
    document.querySelector(".messages").scrollHeight;
}

function clearMessages() {
  var message = document.getElementById("message");
  while (message.firstChild) {
    message.removeChild(message.firstChild);
  }
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
}

function selectedPerson(name) {
  //zamana göre mesajları gösterme
  console.log(name);
  clearMessages();
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
          people[i].profile_photo,
          people[i].messages[j].message
        );
      }
    } else {
      document.getElementById(people[i].name).classList.remove("active");
    }
  }
}

function loadContact() {
  var contact = document.getElementById("add-contacts");

  for (var i = 0; i < Object.keys(people).length; i++) {
    var add = document.createElement("li");
    add.classList.add("add");

    var wrapDiv = document.createElement("div");
    wrapDiv.classList.add("wrap");

    var statusSpan = document.createElement("span");
    statusSpan.classList.add(("contact-status", people[i].status));
    wrapDiv.appendChild(statusSpan);

    var img = document.createElement("img");
    img.setAttribute("src", people[i].profile_photo);
    img.setAttribute("alt", "");
    wrapDiv.appendChild(img);

    var metaDiv = document.createElement("div");
    metaDiv.classList.add("meta");

    var namePara = document.createElement("p");
    namePara.classList.add("name");
    namePara.textContent = people[i].name;
    metaDiv.appendChild(namePara);

    wrapDiv.appendChild(metaDiv);
    add.appendChild(wrapDiv);

    contact.innerHTML +=
      '<li id="' +
      people[i].name +
      '"' +
      "class='contact' onclick=selectedPerson(id)>" +
      add.innerHTML +
      "</li>";
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

document.querySelector("#profile-img").addEventListener("click", function () {
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

$(".submit").click(function () {
  newMessage();
});

$(window).on("keydown", function (e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});

const searchAlgorithm = () => {
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
})();*/

//game.js
/*
var canvas = document.querySelector(".game-container");
var ctx = canvas.getContext("2d");

var ball = document.querySelector(".ball");
var paddle1 = document.querySelector(".player-bar-1");
var paddle2 = document.querySelector(".player-bar-2");

var ballSpeedX = 2;
var ballSpeedY = 2;

function update() {
  var ballRect = ball.getBoundingClientRect();
  var paddle1Rect = paddle1.getBoundingClientRect();
  var paddle2Rect = paddle2.getBoundingClientRect();

  if (ballRect.left < paddle1Rect.right || ballRect.right > paddle2Rect.left) {
    ballSpeedX *= -1;
  }

  if (ballRect.top < 0 || ballRect.bottom > canvas.height) {
    ballSpeedY *= -1;
  }

  ball.style.left = ball.offsetLeft + ballSpeedX + "px";
  ball.style.top = ball.offsetTop + ballSpeedY + "px";

  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (event) {
  var paddleSpeed = 5;

  if (event.key === "w") {
    paddle1.style.top = paddle1.offsetTop - paddleSpeed + "px";
  } else if (event.key === "s") {
    paddle1.style.top = paddle1.offsetTop + paddleSpeed + "px";
  }

  if (event.key === "ArrowUp") {
    paddle2.style.top = paddle2.offsetTop - paddleSpeed + "px";
  } else if (event.key === "ArrowDown") {
    paddle2.style.top = paddle2.offsetTop + paddleSpeed + "px";
  }
});
*/

//controller.js

(function () {
  if (isLogin()) 
    isLogin();
})();

function isLogin() {
  const url = window.location.pathname;
  let loginStr = localStorage.getItem(0);
  var login;

  try {
    if (!url.includes("/login")) {
        login = JSON.parse(loginStr);

      if (login.access_token == undefined)  throw new Error("is not login");
    }
  } catch (error) {
    window.location.href = "login";
    router();
    return false;
  }
  return true;
}

