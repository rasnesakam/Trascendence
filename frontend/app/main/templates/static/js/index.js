//İndex.js
//sayısal değerlere define değerler atanabilir

var webRoute = {
  404: "/static/pages/error.html",
  "/": "/static/pages/main.html",
  "/about": "/static/pages/about.html",
  "/game": "/static/pages/game.html",
  "/match": "/static/pages/match.html",
  "/tournament": "/static/pages/tournament.html",
  "/livechat": "/static/pages/livechat.html",
  "/ai": "/static/pages/ai.html",
};


if (window.location.pathname == "/")
  main_load()
else if (window.location.pathname.includes("/users/"))
  profile_load()

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
  if (eventId == "/ai-game") return true;
  return false;
}

var isEventListenerAdded = false;

function router() {
  if (isEventListenerAdded) return;
  var body = document.body;

  body.addEventListener("click", function (event) {
    if (isPassageEvent(event.target.id)) {
      event.preventDefault();

      console.log("pushState giriyorum: ")
      window.history.pushState({}, "", event.target.href);
      console.log("pushStateden çıkıyorum: ");
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

function main_load() {
  let userAccess = JSON.parse(localStorage.getItem(0));
  let username = userAccess.user.username;
  let access_token = userAccess.access_token;

  console.log("access_token: " + access_token);
  let data = loadUserInformation(username, access_token);
  setTournamentList(data.dataTournament);
  setMatches(data.dataMatches);
}

function profile_load() {
  let pathname = window.location.pathname;
  let part = pathname.split('/');
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;

  console.log("access", access_token);
  console.log("myuser: " + part[2])
  loadUserInformation(part[2], access_token);
  setRate(37, 63, "myPieChart");
}


async function setPlayCode()
{
    let playcode = document.getElementById("playcode-input").value;
    let token = JSON.parse(localStorage.getItem(0)).access_token;
    if (playcode != "")
    {
        let response = await fetch("http://localhost/api/profile/update", {
          method: 'PATCH',
          headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({playcode})
        })
        if (!response.ok)
          alert("Hata!")
        let response_data = await response.json()
        let authData = JSON.parse(localStorage.getItem(0))
        authData.user = response_data.new_user;
        localStorage.setItem(0, JSON.stringify(authData));
    }
    else
    {
        document.getElementById("play-code").click();
        alert("Please enter play code");
    }
}


function isPlayCode(data)
{
  alert("isPlayCode")
  console.log(data.has_playcode);
    if (data.has_playcode == undefined || data.has_playcode == false)
    {
        document.getElementById("play-code").click();
        return (false);
    }
    return true;
}

async function loadUserInformation(username, access_token) {
  let userIdentity = await fetch(`http://localhost/api/profile/${username}`, {
    headers: {
      "Authorization": "Bearer " + access_token,
    },
  }).then(data => data.json());

  let dataTournament = await fetch(
    `http://localhost/api/tournaments/user/${username}`, {
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
  isPlayCode(userIdentity)
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
//login.js

document.getElementById("click-search").addEventListener("click", async function (event) {
  profile = document.getElementById("input-search").value;
  let newUrl = `/users/${profile}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
  event.preventDefault();
  console.log("pushState: " + newUrl);
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

function gamePage(webRoute) {
  const webRoute = window.location.href = "/ai";

  if (webRoute) {
    document.querySelectorAll(nav).style.display = "none";
  }
}

gamePage();
