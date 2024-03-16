var winPercentage = 0;
var losePercentage = 0;

function calculateWinLosePercentage(matches, username) {
    winPercentage = 0;
    losePercentage = 0;

    for (var i = 0; i < matches.length; i++) {
        let home_score = matches.matches[i].home.score;
        let away_score = matches.matches[i].away.score;

        if (home_score > away_score)
            if (matches.matches[i].home.user.username == username) winPercentage++;
            else losePercentage++;
        else if (matches.matches[i].away.user.username == username) winPercentage++;
        else losePercentage++;
    }
    winPercentage = (winPercentage / (winPercentage + losePercentage)) * 100;
    losePercentage = 100 - winPercentage;
}


function updateChart() {
    var chart = document.getElementById('chart');

    chart.style.setProperty('--win-percentage', winPercentage + '%');
    chart.style.setProperty('--lose-percentage', losePercentage + '%');
}

profile_load();