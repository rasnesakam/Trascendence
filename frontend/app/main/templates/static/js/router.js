const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  404: "../pages/error.html",
  "/": "../pages/main.html",
  "/about": "../pages/about.html",
  "/lorem": "../pages/match.html",
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((response) => response.text());
  document.getElementById("main-page").innerHTML = html;
  document.querySelector("head-css");
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
