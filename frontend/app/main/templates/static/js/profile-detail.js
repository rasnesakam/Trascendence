(function ()
{
  var matchesCount = 100;
  var winsCount = 37;
  var data = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [matchesCount, winsCount],
        backgroundColor: ["#C60606", "#20C606"],
      },
    ],
  };
  var ctx = document.getElementById("myPieChart").getContext("2d");
  var myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });

  var matchesCount = 1;
  var winsCount = 2;
  var data = {
    labels: ["Lose", "Win"],
    datasets: [
      {
        data: [matchesCount, winsCount],
        backgroundColor: ["#C60606", "#20C606"],
      },
    ],
  };
  var ctx = document.getElementById("myPieChart2").getContext("2d");
  var myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
})()

