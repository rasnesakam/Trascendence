//İndex.js
//sayısal değerlere define değerler atanabilir

var webRoute = {
  404: "/static/pages/error.html",
  "/": "/static/pages/main.html",
  "/about": "/static/pages/about.html",
  "/game": "/static/pages/game.html",
  "/match": "/static/pages/match.html",
  "/finish-match": "/static/pages/finish-match.html",
  "/tournament": "/static/pages/tournament.html",
  "/livechat": "/static/pages/livechat.html",
  "/ai": "/static/pages/ai.html",
  "/pvp": "/static/pages/pvp.html",
};

if (window.location.pathname == "/") main_load();
else if (window.location.pathname.includes("/users/")) profile_load();

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

      console.log("pushState giriyorum: ");
      window.history.pushState({}, "", event.target.href);
      console.log("pushStateden çıkıyorum: ");
      switchPages(event.target.id);
    }
  });
  isEventListenerAdded = true;
}

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
}

//main.js
async function createTournament() {
  let listCheckBox = document.querySelectorAll('#friend-for-tournament input[type="checkbox"]');
  let selectFriends = [];
  for (let i = 0; i < listCheckBox.length; i++) {
    if (listCheckBox[i].checked) selectFriends.push(listCheckBox[i].value);
  }
  if (selectFriends.length < 3) {
    alert("Please select three friends");
    return;
  }
  else if (selectFriends.length > 3) {
    alert("Please select at least 4 friends");
    return;
  }
  let tournamentName = document.getElementById("tournament-name").value;
  let item = JSON.parse(localStorage.getItem(0));
  let access_token = item.access_token;
  selectFriends.push(item.user.username);
  let data = await fetch("http://localhost/api/tournaments/create", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      tournamentName,
      users: selectFriends,
      capacity: 4
    })
  })
    .then((response) => response.json())
    .then(responseData => {
      console.log("responseData: ", responseData);
    })
    .catch((error) => console.log(error));

  console.log("data: ", data);
}


async function setTournamentList(tournaments) {
  let added = document.getElementById("tournamentList");
  added.innerHTML = "";
  if (tournaments == undefined) return;
  for (let i = 0; i < tournaments.length; i++) {
    let code = tournaments[i].tournament_code;
    let whos = await fetch(`http://localhost/api/tournaments/${code}`)
      .then((data) => data.json())
      .catch((error) => console.log(error));

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
    accordionBody.textContent = `1. ${whos[0]} (🥇)\n2. ${whos[1]} (🥈)\n3. ${whos[2]} (🥉)\n4. ${whos[3]} (GG!)`; //1. 2. 3. 4. bilgilerini içerecek
    accordionHeader.appendChild(accordionBody);
    console.log("nediyorsun: " + added);
  }
}

function setMatches(matches, username) {
  let added = document.getElementById("matchList");
  added.innerHTML = "";
  console.log("matches: ", matches);
  if (matches == undefined) return;
  for (let i = 0; i < matches.length; i++) {
    let li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    added.appendChild(li);

    let span1 = document.createElement("span");
    span1.textContent = matches.home + " - " + matches.score; //maçta oynayan kişiler
    li.appendChild(span1);

    let span2 = document.createElement("span");
    span2.textContent = matches.score_home + " - " + matches.score_away; //maç scorları
    li.appendChild(span2);

    if (matches.matches.score_home > matches.score_away)
      if (matches.home == username) li.classList.add("bg-success");
      else li.classList.add("bg-danger");
    else if (matches.away == username) li.classList.add("bg-success");
    else li.classList.add("bg-danger");
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
  let part = pathname.split("/");
  let data = JSON.parse(localStorage.getItem(0));
  let access_token = data.access_token;

  console.log("data page", data);
  loadUserInformation(part[2], access_token);
  isMyFriend(data.user.username, part[2], access_token);
  isBlock(data.user.username, part[2], access_token);
  //setRate(37, 63, "myPieChart");
}

async function loadInvateFriend() {
  let friends = await fetch(`http://localhost/api/interacts/friends`, { headers: { Authorization: `Bearer ${access_token}` } }).then(data => data.json());
  let list = document.getElementById("friend-for-tournament");

  for (let i = 0; i < friends.length; i++) {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    list.appendChild(li);

    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", friends[i].username);
    input.setAttribute("id", friends[i].username);
    li.appendChild(input);

    let label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", friends[i].username);
    label.textContent = friends[i].username;
    li.appendChild(label);
  }
}

async function setPlayCode() {
  let playcode = document.getElementById("playcode-input").value;
  let token = JSON.parse(localStorage.getItem(0)).access_token;
  if (playcode != "") {
    let response = await fetch("http://localhost/api/profile/update", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playcode }),
    });
    if (!response.ok) alert("Hata!");
    let response_data = await response.json();
    let authData = JSON.parse(localStorage.getItem(0));
    authData.user = response_data.new_user;
    localStorage.setItem(0, JSON.stringify(authData));
  } else {
    document.getElementById("play-code").click();
    alert("Please enter play code");
  }
}

function isBlock(username, friend, access_token) {
  let myBlock = fetch(`http://localhost/api/interacts/blacklist`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((data) => data.json());

  for (let i = 0; i < myBlock.length; i++) {
    if (myBlock[i].username == friend) {
      document.getElementById("add-friend-button").style.display = "none";
      document.getElementById("delete-friend-button").style.display = "none";
      document.getElementById("friend-block-button").style.display = "none";
      document.getElementById("friend-unblock-button").style.display = "block";

      return;
    }
  }
}

function isMyFriend(username, friend, access_token) {
  if (username == friend) {
    document.getElementById("add-friend-button").style.display = "none";
    return;
  } else document.getElementById("add-friend-button").style.display = "block";

  let myFriend = fetch(`http://localhost/api/interacts/friends`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then((data) => data.json());

  for (let i = 0; i < myFriend.length; i++) {
    if (myFriend[i].username == friend) {
      document.getElementById("add-friend-button").style.display = "none";
      document.getElementById("delete-friend-button").style.display = "block";
      return;
    }
  }
}

function isPlayCode(data) {
  console.log(data.has_playcode);
  if (data.has_playcode == undefined || data.has_playcode == false) {
    document.getElementById("play-code").click();
    return false;
  }
  return true;
}

async function loadUserInformation(username, access_token) {
  let userIdentity = await fetch(`http://localhost/api/profile/${username}`, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((data) => data.json());

  let dataTournament = await fetch(
    `http://localhost/api/tournaments/user/${username}`,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  ).then((data) => data.json());

  let dataMatches = await fetch(`http://localhost/api/matches/${username}`, {
    headers: {
      Authorization: "Bearer " + access_token,
    },
  }).then((data) => data.json());

  localStorage.setItem(1, JSON.stringify(userIdentity));
  document.getElementById("nickname").innerHTML = userIdentity.user.username;
  document.getElementById("pr-name").innerHTML = userIdentity.user.name; //username html
  document.getElementById("pr-surname").innerHTML = userIdentity.user.surname; //surname add html
  document.getElementById("profile-photo").src = userIdentity.user.avatarURI;
  document.getElementById("total_tournament").innerHTML = dataTournament.length; //Torunament add html
  document.getElementById("total_match").innerHTML = dataMatches.length; //match added html
  document.getElementById("enemy").innerHTML = userIdentity.user.rival;

  let resultData = { userIdentity, dataTournament, dataMatches };
  isPlayCode(userIdentity.user);
  return resultData;
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
}

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
}

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
}

function changePhoto() {
  let control = document.getElementById("close-icon").style;
  if (control.display == "block") {
    document.getElementById("fileInput").click();
  }
}

function outLogin() {
  localStorage.removeItem(0);
  window.location.href = "/login";
}

//profile-detail.js
/*
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

async function getNotification() {
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  let data = await fetch("http://localhost/api/interacts/invitations/", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
  console.log("data:", data);
  document.getElementById("notify-list").innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    let msg = data.content[i].to.username + ": " + data.content[i].note;
    addNotify(msg, data.content[i].invite_code, "responseFriend");
  }
  return data;
}

async function requestAddFriend() {
  let profileNickName = document.getElementById("nickname").textContent;
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  console.log("nickname " + profileNickName);
  await fetch("http://localhost/api/interacts/friends/add", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      username: profileNickName,
      message: "would you like to be friends?",
    }),
  })
    .then(async (responseCode) => {
      if (!responseCode.ok) {
        throw new Error("Error sending friend request");
      }
      document.getElementById("add-friend-button").style.display = "none";
      document.getElementById("delete-friend-button").style.display = "block";
      return responseCode.json();
    })
    .then((data) => {
      data.invitation_code;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

async function requestDeleteFriend() {
  let profileNickName = document.getElementById("nickname").textContent;
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  console.log("nickname " + profileNickName);
  await fetch(
    `http://localhost/api/interacts/friends/delete/${profileNickName}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )
    .then(async (responseCode) => {
      if (!responseCode.ok) {
        throw new Error("Error sending friend request");
      }
      document.getElementById("add-friend-button").style.display = "block";
      document.getElementById("delete-friend-button").style.display = "none";
      return responseCode.json();
    })
    .then((data) => {
      data.invitation_code;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

async function requestBlock() {
  let profileNickName = document.getElementById("nickname").textContent;
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  await fetch("http://localhost/api/interacts/blacklist/add", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      username: profileNickName,
    }),
  })
    .then(async (responseCode) => {
      if (!responseCode.ok) {
        throw new Error("Error sending friend request");
      }
      document.getElementById("add-friend-button").style.display = "none";
      document.getElementById("delete-friend-button").style.display = "none";
      document.getElementById("friend-block-button").style.display = "none";
      document.getElementById("friend-unblock-button").style.display = "block";

      return responseCode.json();
    })
    .then((data) => {
      data.invitation_code;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

async function requestUnBlock() {
  let profileNickName = document.getElementById("nickname").textContent;
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  await fetch(
    `http://localhost/api/interacts/blacklist/${profileNickName}/delete`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  )
    .then(async (responseCode) => {
      if (!responseCode.ok) {
        throw new Error("Error sending friend request");
      }
      document.getElementById("add-friend-button").style.display = "block";
      document.getElementById("delete-friend-button").style.display = "none";
      document.getElementById("friend-block-button").style.display = "block";
      document.getElementById("friend-unblock-button").style.display = "none";
      return responseCode.json();
    })
    .then((data) => {
      data.invitation_code;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
}

//login.js

document
  .getElementById("click-search")
  .addEventListener("click", async function (event) {
    profile = document.getElementById("input-search").value;
    event.preventDefault();
    let users = await fetch(`http://localhost/api/users/search/${profile}`, {
      headers: {
        "Content-type": "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("User not found");
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
      if (users == undefined) {
        alert("User not found");
        return ;
      }
      let newUrl = `/users/${profile}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
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

function gamePage() {
  if (window.location.pathname === "/ai") {
    const nav = document.getElementById("index-navbar");

    if (nav) {
      nav.style.display = "none";
    }
  }
}

gamePage();
