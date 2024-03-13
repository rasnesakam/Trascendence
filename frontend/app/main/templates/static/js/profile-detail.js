var winPercentage = 70;
var losePercentage = 30;

function updateChart(win, lose) {
    var chart = document.getElementById('chart');

    chart.style.setProperty('--win-percentage', win + '%');
    chart.style.setProperty('--lose-percentage', lose + '%');
}

updateChart(winPercentage, losePercentage);


function profile_load() {
    let pathname = window.location.pathname;
    let part = pathname.split("/");
    let data = JSON.parse(localStorage.getItem(0));
    let access_token = data.access_token;

    console.log("data page", data);
    loadUserInformation(part[2], access_token);
    isMyFriend(data.user.username, part[2], access_token);
    isBlock(data.user.username, part[2], access_token);
}
