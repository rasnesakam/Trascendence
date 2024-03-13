var winPercentage = 70;
var losePercentage = 30;

function updateChart(win, lose) {
    var chart = document.getElementById('chart');

    chart.style.setProperty('--win-percentage', win + '%');
    chart.style.setProperty('--lose-percentage', lose + '%');
}

updateChart(winPercentage, losePercentage);
