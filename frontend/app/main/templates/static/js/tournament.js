//tournament.js


users = [];
let map_allUser = new Map();
let map_stage = 0;
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

	let myHref = `/match?tournament=${tournament_code}&match=${match_code}`;
  window.history.pushState({ path: myHref }, "", myHref);
  switchPages(window.location.href);
}

//tournament kodunu url içerisine al
//2. parametreyede match kodunu gir match koduyla giriş yapılacak
//turnuva bittikten sonra tekrar o url kullanılarak turnuva sayfasına yönledirileceğiz
function putPhotoTournament()
{
	for (let i = 0; i < map_stage; i++)
	{
		let rank = 4;
		let stageInformation = map_allUser.get(i);
		for (let j = 0; j < stageInformation.size; j++) //stage 1 - 2 - 3
		{
			let user = stageInformation.get(j);
			if (j == 0)
				rank = rank / user.stage;

			console.log(user);
			document.querySelectorAll(`.state-${user.stage}-${rank}`)[0].src = user.user.avatarURI;
			document.querySelectorAll(`.state-${user.stage}-${rank - 1}`)[0].src = user.pair_user.avatarURI;
			rank -= 1;
		}
	}
}

async function loadTournament()
{
  let queryParams = new URLSearchParams(window.location.search)

  let allUser = new Map();
  let index = 0;

  for (let i = 0; i < users.length; i++)
  {
	let user_one = users.content[i].user.id;
	for (let j = 0; j < users.length; j++)
	{
		if (user_one == users.content[j].pair_user.id)
		{
			allUser.set(index, users.content[j]);
			index++;
			map_allUser.set(map_stage++, allUser);
		}
	}
  }

  putPhotoTournament()
  startTournament(queryParams.get("tournament"));
}

// Set the date we're counting down to
var countDownDate = new Date().getTime() + 140000;

// Update the count down every 1 second
var timer = setInterval(function() {

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
    document.getElementById("tournament-timer").innerText = "CANCELLED";
    clearInterval(timer)
    clearInterval(enter_tournament)
    window.history.pushState({ path: "/" }, "", "/");
    switchPages(window.location.href);
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
	let pairs = []
	let matchs = new Map();

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
	for (let i = 0; i < users.length; i++)
	{
		putPhotoTournament();
		if (users.content[i].has_pair == true)
			match_making++;
	}
	if (match_making > 3)
	{
		clearInterval(timer);
		document.getElementById("tournament-timer").style.display = "none";
		clearInterval(enter_tournament);
		loadTournament();
	}
}, 7000);
