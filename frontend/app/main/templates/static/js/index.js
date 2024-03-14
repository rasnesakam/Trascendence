// ROUTER START
// SPA

const root = document.getElementById("index-body");

const routes = new Map([
  [/^\/$/, "main.html"],
  [/^\/game/, "game.html"],
  [/^\/login/, "login.html"],
  [/^\/tournament/, "tournament.html"],
  [/^\/about/, "about.html"],
  [/^\/users/, "profile-detail.html"],
  [/^\/livechat/, "livechat.html"],
  [/^\/match/, "match.html"],
  [/^\/score/, "score.html"],
  [/^\/finish-match/, "finish-match.html"],
  [/^\/ai/, "ai.html"],
]);

function renderPage() {
  // ( btekinli is wait )
  const route = location.pathname;
  const page = determinePage(route);

  fetchPage(`/static/pages/${page}`);
}

async function fetchPage(url) {
  // ( btekinli is wait )
  try {
    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const html = await response.text();
    root.innerHTML = html;
    renderPageWithScripts(page);
  } catch (error) {
    console.error("Page fetching error:", error);
  }
}

function determinePage(route) {
  // ( btekinli is wait )
  let page = "error-404.html";

  routes.forEach((v, k) => {
    if (k.test(route)) page = v;
  });

  return page;
}

function renderPageWithScripts(page) {
  // ( btekinli is wait )
  const scripts = [`/static/js/${page}.js`];
  loadScripts(scripts, initializeComponents);
}

function loadScripts(scripts, callback) {
  // ( btekinli is wait )
  let loadedScripts = 0;
  const head = document.head;

  function scriptLoaded() {
    loadedScripts++;
    if (loadedScripts === scripts.length) callback();
  }

  scripts.forEach((script) => {
    const scriptTag = document.createElement("script");
    scriptTag.src = script;

    scriptTag.onload = scriptLoaded;
    scriptTag.onerror = scriptLoaded;

    head.appendChild(scriptTag);
  });
}

function initializeComponents() {
  // ( btekinli is wait )
  document
    .querySelector(".carousel-control-next")
    .addEventListener("click", () => {
      aboutSliderScript();
    });

  document
    .querySelector(".carousel-control-prev")
    .addEventListener("click", () => {
      aboutSliderScript(false);
    });

  aboutSliderScript();
}

document.addEventListener("click", (event) => {
  // ( btekinli is wait )
  const { target } = event;

  if (target.tagName === "a") {
    event.preventDefault();

    const path = new URL(ttarget.href).pathname;
    history.pushState(null, null, path);
    renderPage();
  }
});

window.addEventListener("popstate", (_event) => {
  // ( btekinli is wait )
  renderPage();
});

// notification-js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function responseTournament(response, code) {
  //html içerisine turnuva bildirimi atar
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
  //html içerisine arkadaşlık bildirimi atar
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

async function requestAddFriend() {
  //arkadaşlık isteğini kabul eder
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
  //ardaşlık isteğini kabul etmediğimizde bildirimi reddeder
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

function removeNotify(code) {
  //html içerisineden bildirim siler
  console.log("code", code);
  let notification = document.getElementById(code);
  console.log("REMOVE REMOVE NOTIFY: ", notification);
  notification.remove();
}

async function getNotification() {
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  let listUrl = [
    "http://localhost/api/interacts/invitations",
    "http://localhost/api/tournaments/invitations",
  ];
  document.getElementById("notify-list").innerHTML = "";
  let listFunction = ["responseFriend", "responseTournament"];

  for (let i = 0; i < listUrl.length; i++) {
    let data = await fetch(listUrl[i], {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));

    for (let j = 0; j < data.length; j++) {
      let msg = data.content[j].from.username + ": " + data.content[j].note;
      addNotify(msg, data.content[j].invite_code, listFunction[i]);
    }
  }
}

// about.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const totalImages = 28;
let currentSlide = 0;

function aboutSliderScript(next = true) {
  // ( btekinli is wait )
  currentSlide = next
    ? (currentSlide + 1) % totalImages
    : (currentSlide - 1 + totalImages) % totalImages;
  const newImageNumber = currentSlide + 1;
  const newImagePath = `/static/assets/slider-photo/${newImageNumber}.jpg`;

  const carouselInner = document.querySelector(".carousel-inner");
  const currentActive = carouselInner.querySelector(".active");

  const newImage = document.createElement("img");
  newImage.classList.add("d-block", "w-100", "h-50");
  newImage.src = newImagePath;
  newImage.alt = `Slide ${newImageNumber}`;

  currentActive.innerHTML = "";
  currentActive.appendChild(newImage);
}

// ai.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function gamePage() {
  // ( btekinli is wait )
  if (
    window.location.pathname === "/ai" ||
    window.location.pathname === "/pvp"
  ) {
    const nav = document.getElementById("index-navbar");

    if (nav) {
      nav.style.display = "none";
    }
  }
}

gamePage();

// controller.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// finish-match.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// index.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// livechat.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// login.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// main.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function clickOpcity(section, othSection) {
  //user change information modunda resmin üzerine gelindiğinde resmin biraz daha açık olmasını sağlıyor
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
  //resme tıklanıldığında resim değiştirmek için ekran açmaya yarar
  let control = document.getElementById("close-icon").style;
  if (control.display == "block") {
    document.getElementById("fileInput").click();
  }
}

function outLogin() {
  //çıkış yapmak için kullanılır
  localStorage.removeItem(0);
  window.location.href = "/login";
}

function updateProfile() {
  //user change information moduna geçmek için kullanılır
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
  //user change information modundan çıkmak için kullanılır
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

function isPlayCode(data) {
  //main page kullanıcıların başta karşılaşacakları ekrandır ve bu ekranda playcodeları olup olmadığı sorgulanır ve eğer yoksa playcode ekranı modal olarak çağrılır
  console.log(data.has_playcode);
  if (data.has_playcode == undefined || data.has_playcode == false) {
    document.getElementById("play-code").click();
    return false;
  }
  return true;
}

async function setPlayCode() {
  //yeni giriş yapan kullanıcılardna playcodelarının geçerli olup olmadığına bakar ve dataya gönderir
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

//- ** main.js **
//- ** profile-detail.js **
async function loadUserInformation(username, access_token) {
  //kullanıcı bilgilerini datadan çeker ve html içerisinde gerekli yerlere yerleştirir
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

async function loadInvateFriend() {
  //tournament create buttonun içersiinde yer alan checkbox arkadaş listesinin htmlini oluşturur.
  let access_token = JSON.parse(localStorage.getItem(0)).access_token;
  let friends = await fetch(`http://localhost/api/interacts/friends`, {
    headers: { Authorization: `Bearer ${access_token}` },
  }).then((data) => data.json());
  let list = document.getElementById("friend-for-tournament");

  console.log("friends", friends);
  list.innerText = "";
  for (let i = 0; i < friends.length; i++) {
    let li = document.createElement("li");
    li.classList.add("list-group-item");

    let input = document.createElement("input");
    input.classList.add("form-check-input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("value", friends.content[i].username);
    input.setAttribute("id", friends.content[i].username);
    li.appendChild(input);

    let label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", friends.content[i].username);
    label.textContent = friends.content[i].username;
    li.appendChild(label);
    list.appendChild(li);
  }
}

async function saveUserInformation() {
  //kullanıcı bilgilerini günceller ve dataya gönderir
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
      playcode: code,
    };
  else
    var response = {
      username: user.user.username,
      name: user.user.name,
      surname: user.user.surname,
    };

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
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error sending friend request");
        }
        return response.json();
      })
      .catch((error) => {
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
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error update");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });

  loadUserInformation(user.user.username, data.access_token);
  closeUpdateProfile();
}

async function createTournament() {
  //yeni bir turnuva oluşturur ve bildirini attırır
  let listCheckBox = document.querySelectorAll(
    '#friend-for-tournament input[type="checkbox"]'
  );
  let selectFriends = [];
  let tournamentName = document.getElementById("tournament-name").value;
  if (tournamentName == "") {
    alert("Plese enter tournament name");
    return;
  }
  for (let i = 0; i < listCheckBox.length; i++) {
    if (listCheckBox[i].checked) selectFriends.push(listCheckBox[i].value);
  }
  if (selectFriends.length < 3) {
    alert("Please select three friends");
    return;
  } else if (selectFriends.length > 3) {
    alert("Please select at least 4 friends");
    return;
  }
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
      capacity: 4,
    }),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));

  window.location.href = `/tournament?tournament=${data.tournament_code}`;
}

async function setTournamentList(tournaments) {
  //yapılan turnuva listesini html içerisine atar
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
  }
}

function setMatches(matches, username) {
  //yapılan maç listesini html içerisine atar
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
  //main page içerisinde yüklenmesi, fetchlenmesi gereken bilgileri getirmek için kullanılır
  let userAccess = JSON.parse(localStorage.getItem(0));
  let username = userAccess.user.username;
  let access_token = userAccess.access_token;

  console.log("access_token: " + access_token);
  let data = loadUserInformation(username, access_token);
  setTournamentList(data.dataTournament);
  setMatches(data.dataMatches);
}

// match.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// profile-detail.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

async function requestBlock() {
  //bir kişiyi engeller
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
  //engellenen kişiyi engellemekten çıkartır
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

function isMyFriend(username, friend, access_token) {
  //profile detail içerisinde kullanıcının arkadaşı olup olmadığı kontrol ediliyor arkadaş olduğumuz kişileri tekrar ekleyememek için tasarlandı
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

function isBlock(username, friend, access_token) {
  //profile detail içerisinde kullanıcının engellenip engellenmediği kontrol ediliyor
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

function profile_load() {
  //profile-detail page içerisinde yüklenmesi, fetchlenmesi gereken bilgileri getirmek için kullanılır
  let pathname = window.location.pathname;
  let part = pathname.split("/");
  let data = JSON.parse(localStorage.getItem(0));
  let access_token = data.access_token;

  console.log("data page", data);
  loadUserInformation(part[2], access_token);
  isMyFriend(data.user.username, part[2], access_token);
  isBlock(data.user.username, part[2], access_token);
}

// pvp.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// score.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// tournament.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// websocket.js-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
