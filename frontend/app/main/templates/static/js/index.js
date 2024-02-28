document.write('<script src="/static/js/livechat.js"></script>');
document.write('<script src="/static/js/controller.js"></script>');
document.write('<script src="/static/js/main.js"></script>')
document.write('<script src="/static/js/login.js"></script>')

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
