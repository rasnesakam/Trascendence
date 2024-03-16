//tournament.js

var users = undefined;
let map_allUser = new Map();
let map_stage = 0;
let urlSearchParam = new URLSearchParams(window.location.search)
const access_token = JSON.parse(localStorage.getItem(0)).access_token;

async function takeUsers(tournament_code) {
	if (users == undefined) {
		users = await fetch(`http://localhost/api/tournaments/${tournament_code}/players`,
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${access_token}`,
				},
			})
			.then((response) => response.json())
			.catch((error) => console.log(error));
	}
}

async function startTournament(tournament_code) {
	let match = await fetch(`http://localhost/api/tournaments/${tournament_code}/next-match`,
		{
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${access_token}`,
			}
		})
		.then((response) => {
			if (response.status == 404) {
				window.location.href = "/score" + window.location.search;
			}
			return response.json()
		})
		.catch((error) => console.log(error));

	console.log("fetchMatch: ", match);
	let myHref = `/match?tournament=${tournament_code}&match=${match.match_code}`;
	console.log("myHref ", myHref);
	setTimeout(() => {
		window.location.href = myHref;
	}, 5000);
}

//tournament kodunu url içerisine al
//2. parametreyede match kodunu gir match koduyla giriş yapılacak
//turnuva bittikten sonra tekrar o url kullanılarak turnuva sayfasına yönledirileceğiz
function putPhotoTournament() {
	for (let i = 0; i < map_stage; i++) {
		let rank = 4;
		let stageInformation = map_allUser.get(i);
		for (let j = 0; j < stageInformation.size; j++) //stage 1 - 2 - 3
		{
			let user = stageInformation.get(j);
			if (j == 0)
				rank = rank / user.stage;

			console.log("putPhotoTournament:", user);
			document.querySelectorAll(`.state-${user.stage}-${rank}`)[0].src = user.user.avatarURI;
			if (rank > 1 && user.pair_user != null)
				document.querySelectorAll(`.state-${user.stage}-${rank - 1}`)[0].src = user.pair_user.avatarURI;
			rank -= 1;
		}
	}
}

async function loadTournament() {
	let queryParams = urlSearchParam;

	let allUser = new Map();
	let index = 0;

	await takeUsers(urlSearchParam.get("tournament"));
	for (let i = 0; i < users.length; i++) {
		let user_one = users.content[i].user.id;
		for (let j = 0; j < users.length; j++) {
			// if (user_one == ((users.content[j].pair_user != null && users.content[j].pair_user.id == user_one) || users.content[j].has_pair == false))
			if ((users.content[j].pair_user != null && user_one == users.content[j].pair_user.id )|| users.content[j].has_pair == false)
			{
				allUser.set(index, users.content[j]);
				index++;
				map_allUser.set(map_stage++, allUser);
			}
		}
	}
	console.log("loadTournament2: ", user);
	putPhotoTournament()
	console.log("start tournament");
	setTimeout(startTournament(queryParams.get("tournament")), 2000);

}

var countDownDate = new Date().getTime() + 140000;

var timer = setInterval(function () {
	if (!urlSearchParam.has("match")) {
		var now = new Date().getTime();
		var distance = countDownDate - now;

		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		document.getElementById("tournament-timer").innerText = "Timer: " + minutes + "m " + seconds + "s";

		if (distance < 0) {
			document.getElementById("tournament-timer").innerText = "CANCELLED";
			clearInterval(timer)
			clearInterval(enter_tournament)
			window.location.href = "/"
		}
	}
	else {
		document.getElementById("tournament-timer").style.display = "none";
		clearInterval(enter_tournament);
		loadTournament();
	}
}, 1000);

var enter_tournament = setInterval(async () => {
	if (!urlSearchParam.has("match")) {
		let tournament_code = urlSearchParam.get("tournament");

		await takeUsers(tournament_code);
		//for (let i = 0; i < users.length; i++)
		//{

		//}
		//users.content.filter(player => player.stage == 1).forEach((player) =>{
		//	if (player.has_pair){
		//		let pair1 = {`${player.user.id}`: `${player.pair_user.id}`}
		//		let pair2 = [player.pair_user.id, player.user.id]
		//		if (pairs.indexOf(pair1) == -1 && pairs.indexOf(pair2))
		//			pairs.push(pair1)
		//	}
		//});
		let match_making = 0;
		console.log("how: -1-", user);
		for (let i = 0; i < users.length; i++) {
			if (users.content[i].stage == 1 && users.content[i].pair_user == null)
				continue;
			match_making++;
		}
		if (match_making > 3) {
			clearInterval(timer);
			document.getElementById("tournament-timer").style.display = "none";
			clearInterval(enter_tournament);
			loadTournament();
		}
	}
	else {
		document.getElementById("tournament-timer").style.display = "none";
		clearInterval(enter_tournament);
		loadTournament();
	}
}, 7000);


