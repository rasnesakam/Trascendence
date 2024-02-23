(function () {
	isLogin();
})()

function isLogin()
{
	const url = window.location.pathname;
	const login = JSON.parse(localStorage.getItem(0));

	console.log(login);
	console.log(url);
	if (url != "/login" && (login == null || !login.login))
	{
		window.location.href = "login";
		return (false);
	}
	return (true);
}