var winPercentage = 58;
var losePercentage = 42;

function updateChart(win, lose) {
    var chart = document.getElementById('chart');
    chart.style.setProperty('--win-percentage', win + '%');
}

updateChart(winPercentage, losePercentage);
