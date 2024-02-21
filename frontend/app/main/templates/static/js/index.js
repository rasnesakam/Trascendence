const routes = {
	404: "/static/pages/error.html",
	"/": "/static/pages/main.html",
	"/about": "/static/pages/about.html",
	"/game": "/static/pages/game.html",
	"/match": "/static/pages/match.html",
	"/profile-detail": "/static/pages/profile-detail.html",
	"/tournament": "/static/pages/tournament.html",
	"/livechat": "/static/pages/livechat.html",
  };

const router = () => {
    event = window.event;
    event.preventDefault();
	console.log("Look at me")
    window.history.pushState({}, '', event.target.href);
    switchPages();
  };

  const switchPages= async () => {
	const path = window.location.pathname;
	const route = routes[path] || routes[404];
	const html = await fetch(route).then((response) => response.text());

	parser = new DOMParser();
	xmlDoc = parser.parseFromString(html,"text/html");

	const xmlHead = xmlDoc.head.innerHTML;
	const xmlBody = xmlDoc.body.innerHTML 
					+ "<script src='/static/js/index.js'></script>";

	document.getElementById("index-head").innerHTML = xmlHead;
	document.getElementById("index-body").innerHTML = xmlBody;
	console.log("ama yine sensiz");
  };
  
