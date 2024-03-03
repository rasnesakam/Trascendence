(function ()
{
    takeUrl();
})()

function control_password(name)
{
    let in_pass = document.getElementById("register-password");
    let get = document.getElementById(name);
    if (name == "")
        if (in_pass.value == get.value)
            document.getElementById("input-password-too").style.color = "green";
        else
            document.getElementById("input-password-too").style.color = "red";
    else
        if (get.value.size() > 6)
            document.getElementById("input-password").style.color = "green";
        else
            document.getElementById("input-password").style.color = "yellow";
}


async function takeUrl() {
    let url = "http://localhost/api/auth/sign-in/42"
    let myUrl = window.location.search;
    searchParams = new URLSearchParams(myUrl);
    alert(myUrl);
    if (searchParams.has("code")) {
        alert("url girdi");
      await fetch(url, {
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
          console.log(data);
  
          localStorage.setItem(0, JSON.stringify(data));
          window.location.href = "/";
          return data;
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
  