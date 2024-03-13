//İndex.js
//sayısal değerlere define değerler atanabilir

var webRoute = {
  404: "/static/pages/error.html",
  "/": "/static/pages/main.html",
  "/about": "/static/pages/about.html",
  "/game": "/static/pages/game.html",
  "/match": "/static/pages/match.html",
  "/finish-match": "/static/pages/finish-match.html",
  "/profile-detail": "/static/pages/profile-detail.html",
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

async function switchPages(eventId) {
  const path = window.location.pathname;
  if (path.includes("?"))
    path = path.split("?");
  var route = webRoute[path[0]] || webRoute[404];

  if (path.includes("/users/")) {
    route = "/static/pages/profile-detail.html";
  }

  const html = await fetch(route)
    .then((response) => response.text())
    .catch((error) => alert(error));

  document.getElementById("index-body").innerHTML = html;
  whichEvent(eventId);
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

  localStorage.setItem("my-profile", JSON.stringify(userIdentity));
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

async function saveUserInformation() {
  //user save is not enough because you have to send it to backend
  var user = JSON.parse(localStorage.getItem("my-profile"));
  var data = JSON.parse(localStorage.getItem(0));

  user.user.username = document.getElementById("nicknameInput").value;
  user.user.name = document.getElementById("nameInput").value;
  user.user.surname = document.getElementById("surnameInput").value;
  var code = document.getElementById("playcod").value;

  if (code != undefined && code != null)
    var response = {
      username: user.user.username,
      name: user.user.name,
      surname: user.user.surname,
      playcode: code
    };
  else
    var response = {
      username: user.user.username,
      name: user.user.name,
      surname: user.user.surname,
    };
    
  console.log("code deneme:", code);
  localStorage.setItem("my-profile", JSON.stringify(user));

  let userphoto = document.getElementById("profile-photo").src;

  if (user.user.avatarURI != userphoto) {
    let photo = await fetch("http://localhost/api/uploads/upload", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${data.access_token}`,
      },
      body: JSON.stringify({
        avatarURI: userphoto,
      })
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error sending friend request");
      }
      return response.json();
    }).catch((error) => {
      console.error("Fetch error:", error);
      throw error;
    });
    response.avatarURI = photo.file;
  }


  await fetch("http://localhost/api/profile/update", {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${data.access_token}`,
    },
    body: JSON.stringify(response),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error update");
    }
    return response.json();
  }).catch((error) => {
    console.error("Fetch error:", error);
  });

  loadUserInformation(user.user.username, data.access_token);
  closeUpdateProfile();
}

function removeSubstring(originalString, substringToRemove) {
  return originalString.replace(substringToRemove, "");
}

function updateProfile() {
  var user = JSON.parse(localStorage.getItem("my-profile"));
  document.getElementById("close-icon").style.display = "block";
  document.getElementById("setting-icon").style.display = "none";
  document.getElementById("save-icon").style.display = "block";
  document.getElementById("profile-photo").classList.add("darken-on-hover");
  document.getElementById("nickname").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("surname").style.display = "none";
  document.getElementById("information").style.display = "block";
  document.getElementById("questions").style.display = "block";

  document.getElementById("nicknameInput").value = user.user.username;
  document.getElementById("nameInput").value = user.user.name;
  document.getElementById("surnameInput").value = user.user.surname;
  if (document.getElementById("playcod").value != "")
    document.getElementById("playcode-input").value = user.user.playcode;
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
      return;
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
  if (window.location.pathname === "/ai" || window.location.pathname === "/pvp") {
    const nav = document.getElementById("index-navbar");

    if (nav) {
      nav.style.display = "none";
    }
  }
}

gamePage();
