var myUrl;

(function () {
  myUrl = window.location.search;
  searchParams = new URLSearchParams(myUrl)

  console.log("code is: " + searchParams.get("code"));
})();

function takeUrl() {
  if (myUrl.includes("id")) {
	var findIndex = myUrl.index("id");
	var key = myUrl.substring(findIndex);
	
	fetch("https://api.example.com/data", 
	{
		method: 'POST',
		headers: {
			'Content-type': 'application/json'
		}
	})
	.then((response) => {
		if (!response.ok)
			return new Error("Respone is not ok");
		localStorage.setItem('userToken', response);
		return (response);
	})
	.catch(error => {
		alert(error);
	});

    console.log("String içinde 'id' bulundu.");
  } else {
    console.log("String içinde 'id' bulunamadı.");
  }
}
