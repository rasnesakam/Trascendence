//İndex.js
//sayısal değerlere define değerler atanabilir
if (window.location.pathname == "/")
  main_load()

const webRoute = {
  404: "/static/pages/error.html",
  "/": "/static/pages/main.html",
  "/about": "/static/pages/about.html",
  "/game": "/static/pages/game.html",
  "/match": "/static/pages/match.html",
  "/tournament": "/static/pages/tournament.html",
  "/livechat": "/static/pages/livechat.html",
};

//  "/profile-detail": "/static/pages/profile-detail.html",
async function error_404() {
  pageTxt = await fetch(webRoute[404])
    .then((response) => response.text())
    .catch((error) => alert(error));
  document.getElementById("index-navbar").style.display = "none";
  document.getElementById("index-body").innerHTML = pageTxt;
}

async function winCount(data, username) {
  var win = 0;

  for (let i = 0; i < data.size(); i++) {
    if (data.winner.username == username) win++;
  }
  return win;
}

async function whichEvent(id) {
  if (id == "/") {
    main_load();
  } else if (id == "/livechat") {
    disableChat();
    loadContact();
  } else if (id == "login") {
    takeUrl();
  } else if (id.includes("/users/")) {
    profile_load();
  }
}

function isPassageEvent(eventId) {
  if (eventId == "/") return true;
  if (eventId == "/about") return true;
  if (eventId == "/livechat") return true;
  if (eventId == "/login") return true;
  return false;
}

var isEventListenerAdded = false;

function router() {
  if (isEventListenerAdded) return;
  var body = document.body;

  body.addEventListener("click", function (event) {
    if (isPassageEvent(event.target.id)) {
      event.preventDefault();

      window.history.pushState({}, "", event.target.href);
      switchPages(event.target.id);
    }
  });
  isEventListenerAdded = true;
};

async function switchPages(eventId) {
  const path = window.location.pathname;
  var route = webRoute[path] || webRoute[404];

  if (path.includes("/users/")) {
    route = "/static/pages/profile-detail.html";
  }

  const html = await fetch(route)
    .then((response) => response.text())
    .catch((error) => alert(error));

  document.getElementById("index-body").innerHTML = html;
  whichEvent(eventId);
};


//main.js
async function pushFetch(url, data, header = { "Content-type": "application/json" }, pushMethod = "GET") {
  var pushResult = await fetch(url, {
    method: pushMethod,
    headers: header,
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Respone is not ok");
      return response.json();
    })
    .catch((error) => {
      console.log(error);
    });

  return pushResult;
}

function showTournament(tournaments) {
  document.getElementById("tournament").innerHTML = "";
  for (let i = 0; i < tournament.content.size(); i++) {
    // Örnek veri
    var sendType =
      "list-group-item d-flex justify-content-between align-items-center" +
      "bg-warning";
    var sendText = tournaments[i].title;

    // Yeni li elementi oluştur
    var table = document.createElement("li");
    table.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "bg-warning"
    );

    // İlk span (kullanıcı adı ve mesaj)
    var span1 = document.createElement("span");
    span1.classList.add("text-white");
    span1.textContent = sendText;

    // İkinci span (skor)
    var span2 = document.createElement("span");
    span2.classList.add("text-white");
    span2.textContent = score;

    // İlk span'i li elementine ekle
    table.appendChild(span1);

    // İkinci span'i li elementine ekle
    table.appendChild(span2);

    // Doküman içerisindeki "table" ID'li div'e li elementini ekle
    document.getElementById("show_tournament").appendChild(table);
  }
}

//showMatch();

async function setTournamentList(tournaments) {

  let added = document.getElementById("torunamentList");
  added.innerHTML = "";
  for (let i = 0; i < tournaments.length; i++) {
    let code = tournaments[i].tournament_code;
    let whos = await fetch(`http://localhost/api/tournaments/${code}`)
    .then(data => data.json()).catch(error => console.log(error));

    let accordionItem = document.createElement("div");
    accordionItem.classList.add("accordion-item");
    added.appendChild(accordionItem);

    let accordionHeader = document.createElement("h2");
    accordionHeader.classList.add("accordion-header");
    accordionItem.appendChild(accordionHeader);

    let button = document.createElement("button");
    button.classList.add("accordion-button", "bg-color-purple", "text-white");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#tournamentList");
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "tournamentList");
    accordionHeader.appendChild(button);

    let accordionBody = document.createElement("div");
    accordionBody.classList.add("accordion-body");
    accordionBody.textContent;
    accordionHeader.appendChild(accordionBody);
    console.log("nediyorsun: " + added);
  }

}


function setMatches(matches, username) {

  let added = document.getElementById("matchList");
  added.innerHTML = "";
  for (let i = 0; i < matches.length; i++) {
    let li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    added.appendChild(li);

    let span1 = document.createElement("span");
    span1.textContent = matches.home + " - " + matches.score;//maçta oynayan kişiler
    li.appendChild(span1);

    let span2 = document.createElement("span");
    span2.textContent = matches.score_home + " - " + matches.score_away; //maç scorları
    li.appendChild(span2);

    if (matches.matches.score_home > matches.score_away)
      if (matches.home == username)
        li.classList.add("bg-success");
      else
        li.classList.add("bg-danger");
    else
      if (matches.away == username)
        li.classList.add("bg-success");
      else
        li.classList.add("bg-danger");
  }

}

function main_load()
{
  let userAccess = JSON.parse(localStorage.getItem(0));
  let username = userAccess.user.username;
  let access_token = userAccess.access_token;

  console.log("access_token: " + access_token);
  let data = loadUserInformation(username, access_token);
  setTournamentList(data.dataTournament);
  setMatches(data.dataMatches);
}

function profile_load()
{
    let pathname = window.location.pathname;
    let part = pathname.split('/');
    let access_token = JSON.parse(localStorage.getItem(0)).access_token;

    console.log("myuser: " + part[1])
    loadUserInformation(part[1], access_token);
}


async function loadUserInformation(username, access_token) {
  let userIdentity = await fetch(`http://localhost/api/profile/${username}`, {
      headers: {
          "Authorization": "Bearer " + access_token,
      },
  }).then(data => data.json());

  let dataTournament = await fetch(
      `http://localhost/api/tournaments/${username}`, {
      headers: {
          "Authorization": "Bearer " + access_token,
      },
  }).then(data => data.json());

  let dataMatches = await fetch(
      `http://localhost/api/matches/${username}`, {
      headers: {
          "Authorization": "Bearer " + access_token,
      },
  }).then(data => data.json());

  localStorage.setItem(1, JSON.stringify(userIdentity));
  document.getElementById("nickname").innerHTML = userIdentity.username;
  document.getElementById("pr-name").innerHTML = userIdentity.name; //username html
  document.getElementById("pr-surname").innerHTML = userIdentity.surname; //surname add html
  document.getElementById("profile-photo").src = userIdentity.avatarURI;
  document.getElementById("total_tournament").innerHTML = dataTournament.length; //Torunament add html
  document.getElementById("total_match").innerHTML = dataMatches.length; //match added html
  document.getElementById("enemy").innerHTML = userIdentity.rival;

  let resultData = { userIdentity, dataTournament, dataMatches };
  return (resultData);
}


function saveUserInformation() {
  //user save is not enough because you have to send it to backend
  var user = JSON.parse(localStorage.getItem(1));
  user.username = document.getElementById("nicknameInput").value;

  user.name = document.getElementById("nameInput").value;
  user.surname = document.getElementById("surnameInput").value;
  loadUserInformation();
  closeUpdateProfile();
}

function removeSubstring(originalString, substringToRemove) {
  return originalString.replace(substringToRemove, "");
}

function updateProfile() {
  var user = JSON.parse(localStorage.getItem(1));
  document.getElementById("close-icon").style.display = "block";
  document.getElementById("setting-icon").style.display = "none";
  document.getElementById("save-icon").style.display = "block";
  document.getElementById("profile-photo").classList.add("darken-on-hover");
  document.getElementById("nickname").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("surname").style.display = "none";
  document.getElementById("information").style.display = "block";
  document.getElementById("questions").style.display = "block";

  document.getElementById("nicknameInput").value = user.username;
  document.getElementById("nameInput").value = user.name;
  document.getElementById("surnameInput").value = user.surname;

  document.getElementById("profile-photo").style.cursor = "pointer";
};

function closeUpdateProfile() {
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

function clickOpcity(section, othSection) {
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

function changePhoto() {
  let control = document.getElementById("close-icon").style;
  if (control.display == "block") {
    document.getElementById("fileInput").click();
    
  }
};

function outLogin() {
  localStorage.removeItem(0);
  window.location.href = "/login";
}

//livechat.js
/*
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
*/

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
}
/*

/*(function () {
  setRate(37, 63, "myPieChart");
  setRate(2, 1, "myPieChart2");
})();

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

//login.js

document.getElementById("click-search").addEventListener("click", async function (event) {
  profile = document.getElementById("input-search").value;
  let newUrl = `/users/${profile}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
  event.preventDefault();
  await switchPages(newUrl);
});

//back-transition
window.addEventListener("popstate", async function (event) {
  if (event.state) {
    let currentUrl = window.location.pathname;
    event.preventDefault();
    alert("prevent Default knk: " + currentUrl);
    await switchPages(currentUrl);
  }
});
