var user_count = 0;

async function match_making(str)
{
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
		localStorage.setItem(`${str}-player-token`, data);
		document.getElementById(`${str}-expected`).disabled = true;
	})
	.catch(_ => alert("You have to enter your correct information"));
  // matches/player/verify
  
}

setInterval(() => {
	if (user_count == 2)
	{
		documet.getElementById("match-snipped").style = "none";
		documet.getElementById("match-tennis").style = "block";
		document.getElementById("right-expected").disabled = false;
		document.getElementById("left-expected").disabled = false;
		user_count = 0;
		//sayfa değiştir
	}
	else
	{
		documet.getElementById("match-snipped").style = "block";
		documet.getElementById("match-tennis").style = "none";
	}
}, 20000)
