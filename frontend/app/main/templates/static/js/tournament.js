//tournament.js


users = [];
async function startTournament(tournament_code) {
	let access_token = localStorage.getItem(0).access_token;
	await fetch(`tournaments/${tournament_code}/next-match`,
		{
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}
		})
		.then((response) => {
			if (response.status == 400)
				throw Error("Tournament is not started yet");
			return response.json()
		})
		.catch((error) => console.log(error));

	let tournament_code = window.location.search;
	let myHref = `/match?tournament=${tournament_code}&match=${match_code}`;
	document.getElementById("to_match").setAttribute("href", myHref);
	document.getElementById("to_match").onclick();
}

//tournament kodunu url içerisine al
//2. parametreyede match kodunu gir match koduyla giriş yapılacak
//turnuva bittikten sonra tekrar o url kullanılarak turnuva sayfasına yönledirileceğiz
function putPhotoTournament() {
	let rank = 4;
	for (let i = 1; i <= users.length; i++) {
		let user = users.content[i - 1];
		if (user.has_pair == true) {
			for (let j = 1; j <= rank; j++) {
				if (user.stage == j) {
					console.log(i, j)
					document.querySelectorAll(`.state-${i}-${j}`)[0].src = user.user.avatarURI;
					if (j == 2 || j == 4)
						document.querySelectorAll(`.state-${i}-${j - 1}`)[0].src = user.pair_user.avatarURI;
					else
						document.querySelectorAll(`.state-${i}-${j + 1}`)[0].src = user.pair_user.avatarURI;
				}
			}
			rank /= 2;
		}
	}
}

async function loadTournament() {
	startTournament();
}

// Set the date we're counting down to
var countDownDate = new Date().getTime() + 14000;

// Update the count down every 1 second
var timer = setInterval(function () {

	// Get today's date and time
	var now = new Date().getTime();

	// Find the distance between now and the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Output the result in an element with id="demo"
	document.getElementById("tournament-timer").innerText = "Timer: " + minutes + "m " + seconds + "s";

	// If the count down is over, write some text 
	if (distance < 0) {
		document.getElementById("tournament-timer").innerHTML = "CANCELLED";
		clearInterval(timer);
		document.getElementById("to_main").onclick();
	}
}, 1000);
console.log(timer)

var enter_tournament = setInterval(async () => {
	let urlSearchParam = new URLSearchParams(window.location.search)
	let tournament_code = urlSearchParam.get("tournament");
	let access_token = JSON.parse(localStorage.getItem(0)).access_token;
	users = await fetch(`http://localhost/api/tournaments/${tournament_code}/players`,
		{
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${access_token}`,
			},
		})
		.then((response) => response.json())
		.catch((error) => console.log(error));

	let match_making = 0;
	for (let i = 0; i < users.length; i++) {
		putPhotoTournament();
		if (users.content[i].has_pair == true)
			match_making++;
	}
	if (match_making == 4) {
		clearInterval(timer);
		document.getElementById("tournament-timer").style.display = "none";
		clearInterval(enter_tournament);
		startTournament();
	}
}, 7000);

async function createTournament() {
	let listCheckBox = document.querySelectorAll('#friend-for-tournament input[type="checkbox"]');
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
	}
	else if (selectFriends.length > 3) {
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
			capacity: 4
		})
	})
		.then((response) => response.json())
		.then(responseData => {
			console.log("responseData: ", responseData);
		})
		.catch((error) => console.log(error));

	let go_tournament = document.getElementById("to_tournament");
	go_tournament.href = `/tournament?${data.tournament_code}`;
	go_tournament.click();
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
	}
}

