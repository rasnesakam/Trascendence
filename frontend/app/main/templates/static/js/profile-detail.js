(function() 
{
    profile_load();
})

function setRate(win, lose, elementId) {
    var matchesCount = win + lose;
    var winsCount = win;
    var data = {
        labels: ["Lose", "Win"],
        datasets: [
            {
                data: [matchesCount, winsCount],
                backgroundColor: ["#C60606", "#20C606"],
            },
        ],
    };
    var ctx = document.getElementById(elementId).getContext("2d");
    Chart(ctx, {
        type: "doughnut",
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });
    return myPieChart;
}


/*(function () {
  setRate(37, 63, "myPieChart");
  setRate(2, 1, "myPieChart2");
})();
*/
