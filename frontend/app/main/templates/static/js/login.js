var myUrl;

(function () {
  takeUrl();
})();

function takeUrl() {
  myUrl = window.location.search;
  searchParams = new URLSearchParams(myUrl);

  console.log("myUrl: " + myUrl);
  fetch("http://localhost/api/auth/sign-in/42", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      code: searchParams.get("code"),
    }),
  })
    .then((response) => {
      if (!response.ok) return new Error("Respone is not ok");
	  response.login = true;
      localStorage.setItem(0, response);
      window.location.href = "/";
      console.log("response: " + response);
      return response;
    })
    .catch((error) => {
      alert(error);
    });

  console.log("String içinde 'id' bulundu.");
}
