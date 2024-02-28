var myUrl;

(function () {
  takeUrl();
})();

async function takeUrl() {
  myUrl = window.location.search;
  searchParams = new URLSearchParams(myUrl);

  if (searchParams.has("code")) {
    await fetch("http://localhost/api/auth/sign-in/42", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        code: searchParams.get("code"),
      }),
    })
      .then(async (response) => {
        if (!response.ok) return new Error("Respone is not ok");
        return response.json();
      })
      .then((data) => {
        alert("You are logged in: " + myUrl);
        localStorage.setItem(0, JSON.stringify(data));

        window.location.href = "/";
        return data;
      })
      .catch((error) => {
        alert(error);
      });
  }
}
