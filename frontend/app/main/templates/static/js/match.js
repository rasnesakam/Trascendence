var user_count = 0;

async function match_making(str)
{
	alert(`${str}-girdi`);
  let username = document.getElementById(`${str}-input`).value;
  let playcode = document.getElementById(`${str}-playcode`).value;
  let url = "http://localhost/api/matches/player/verify"
  fetch(url, {
	method: "POST",
	headers: {
		"Content-type": "application/json",
	},
	body: JSON.stringify({
		username,
		playcode
	}),
  })
  .then((response) => {
	if (response.ok)
		return response.json()
	})
	.then(responseData => {
		user_count += 1;
		let data = {username, token: responseData.token};

		document.getElementById(`${str}-photo`).src = responseData.user.avatarURI;
		document.getElementById(`${str}-ready-button`).innerText = String(responseData.user.username).toUpperCase();
		localStorage.setItem(`${str}-player-token`, data);
		document.getElementById(`${str}-expected`).disabled = true;
	})
	.catch(_ => alert("You have to enter your correct information"));
  // matches/player/verify
  
}

setInterval(() => {
	console.log("mycount:", user_count);
	if (user_count == 2)
	{
		document.getElementById("match-snipped").style = "none";
		document.getElementById("match-tennis").style = "block";
		document.getElementById("right-expected").disabled = false;
		document.getElementById("left-expected").disabled = false;
		user_count = 0;
	}
	else
	{
		documet.getElementById("match-snipped").style = "block";
		documet.getElementById("match-tennis").style = "none";
	}
}, 20000)

/*
function ready_profile(side, where_photo)
{
	let formHome = document.getElementsByClassName(side)[0]
    formHome.addEventListener('submit', (e) => {
		e.preventDefault()
	})
	let input_username = formHome.getElementsByClassName(`${side}` + "-username")[0]
	let photo = document.getElementById(where_photo);
	let data = JSON.parse(localStorage.getItem(0));
	let username = data.user.username
	let userphoto = data.user.avatarURI;

	input_username.setAttribute("value", username);
	input_username.setAttribute("readonly", true);
	photo.src =  userphoto;
}*/

async function take_matchurl()
{
	let urlSearch = new URLSearchParams(window.location.search);
	let matchcode = urlSearch.get("match");

	let readyMatch =  await fetch(`http://localhost/api/matches/code/${matchcode}`, {
		method: "GET",
		headers: {
			"Content-type": "application/json",
		},
	})
	.then(response => response.json())
	.catch(error => console.log(error));

	ready_profile("form-home", "left-photo");
	ready_profile("form-away", "right-photo");
}
