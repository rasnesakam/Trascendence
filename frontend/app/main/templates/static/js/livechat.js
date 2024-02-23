people = {
  0: {
    name: "Harvey Specter",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message:
          "What are you talking about? You do what they say or they shoot you.",
        date: "2021-01-01",
        time: "13:00",
        type: "replies",
      },
      {
        message:
          "What are you talking about? You do what they say or they shoot you.",
        date: "2021-01-01",
        time: "15:00",
        type: "sent",
      },
      {
        message: "get off",
        date: "2021-01-01",
        time: "17:00",
        type: "sent",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/harveyspecter.png",
    status: "online",
  },
  1: {
    name: "Charles Forstman",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "replies",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/charlesforstman.png",
    status: "offline",
  },
  2: {
    name: "Jonathan Sidwell",
    messages: [
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "sent",
      },
      {
        message: "Merhaba",
        date: "2021-01-01",
        time: "12:00",
        type: "replies",
      },
    ],
    profile_photo: "http://emilcarlsson.se/assets/jonathansidwell.png",
    status: "online",
  },
};

(function () {
  disableChat();
  loadContact();
})();

function sendMessage(sendType, photoWho, sendText) {
  var message = document.createElement("li");
  message.classList.add(sendType);

  var img = document.createElement("img");
  img.src = photoWho;
  message.appendChild(img);

  var para = document.createElement("p");
  para.textContent = sendText;
  message.appendChild(para);

  document.getElementById("message").appendChild(message);
  console.log(message);
  document.querySelector(".messages").scrollTop =
    document.querySelector(".messages").scrollHeight;
}

function clearMessages() {
  var message = document.getElementById("message");
  while (message.firstChild) {
    message.removeChild(message.firstChild);
  }
}

function disableChat() {
  document
    .getElementById("contact-selected-profile-photo")
    .setAttribute(
      "src",
      "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708365600&semt=ais"
    );
  document.getElementById("contact-selected-profile-name").innerHTML = "";
  document.getElementById("message-input").style.display = "none";
}

function selectedPerson(name) {
  //zamana göre mesajları gösterme
  console.log(name);
  clearMessages();
  document.getElementById("message-input").style.display = "block";
  for (i = 0; i < Object.keys(people).length; i++) {
    if (people[i].name == name) {
      document.getElementById(people[i].name).classList.add("active");
      document
        .getElementById("contact-selected-profile-photo")
        .setAttribute("src", people[i].profile_photo);
      document.getElementById("contact-selected-profile-name").innerHTML =
        people[i].name;
      for (j = 0; j < Object.keys(people[i].messages).length; j++) {
        sendMessage(
          people[i].messages[j].type,
          people[i].profile_photo,
          people[i].messages[j].message
        );
      }
    } else {
      document.getElementById(people[i].name).classList.remove("active");
    }
  }
}

function loadContact() {
  var contact = document.getElementById("add-contacts");

  for (var i = 0; i < Object.keys(people).length; i++) {
    var add = document.createElement("li");
    add.classList.add("add");

    var wrapDiv = document.createElement("div");
    wrapDiv.classList.add("wrap");

    var statusSpan = document.createElement("span");
    statusSpan.classList.add(("contact-status", people[i].status));
    wrapDiv.appendChild(statusSpan);

    var img = document.createElement("img");
    img.setAttribute("src", people[i].profile_photo);
    img.setAttribute("alt", "");
    wrapDiv.appendChild(img);

    var metaDiv = document.createElement("div");
    metaDiv.classList.add("meta");

    var namePara = document.createElement("p");
    namePara.classList.add("name");
    namePara.textContent = people[i].name;
    metaDiv.appendChild(namePara);

    wrapDiv.appendChild(metaDiv);
    add.appendChild(wrapDiv);

    contact.innerHTML +=
      '<li id="' +
      people[i].name +
      '"' +
      "class='contact' onclick=selectedPerson(id)>" +
      add.innerHTML +
      "</li>";
  }
}

function connectWebSocket() {
  var socket = new WebSocket("ws://localhost:8080");

  // Bağlantı açıldığında
  socket.addEventListener("open", function (event) {
    console.log("WebSocket bağlantısı açıldı.");
  });

  // Mesaj alındığında
  socket.addEventListener("message", function (event) {
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML += "<p>Received: " + event.data + "</p>";
  });

  // Bağlantı kapandığında
  socket.addEventListener("close", function (event) {
    console.log("WebSocket bağlantısı kapandı.");
  });

  // Hata oluştuğunda
  socket.addEventListener("error", function (event) {
    console.error("WebSocket hatası:", event);
  });

  socket.send;
}

$(".messages").animate({ scrollTop: $(document).height() }, "fast");
$("#profile-img").click(function () {
  $("#status-options").toggleClass("active");
});

$(".expand-button").click(function () {
  $("#profile").toggleClass("expanded");
  $("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function () {
  $("#profile-img").removeClass();
  $("#status-online").removeClass("active");
  $("#status-away").removeClass("active");
  $("#status-busy").removeClass("active");
  $("#status-offline").removeClass("active");
  $(this).addClass("active");

  if ($("#status-online").hasClass("active")) {
    $("#profile-img").addClass("online");
  } else if ($("#status-away").hasClass("active")) {
    $("#profile-img").addClass("away");
  } else if ($("#status-busy").hasClass("active")) {
    $("#profile-img").addClass("busy");
  } else if ($("#status-offline").hasClass("active")) {
    $("#profile-img").addClass("offline");
  } else {
    $("#profile-img").removeClass();
  }

  $("#status-options").removeClass("active");
});

function newMessage() {
  //mesaj göndermek için
  message = $(".message-input input").val();
  if ($.trim(message) == "") {
    return false;
  }
  $(
    '<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' +
      message +
      "</p></li>"
  ).appendTo($(".messages ul"));
  $(".message-input input").val(null);
  $(".contact.active .preview").html("<span>You: </span>" + message);
  $(".messages").animate({ scrollTop: $(document).height() }, "fast");
}

$(".submit").click(function () {
  newMessage();
});

$(window).on("keydown", function (e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});

const searchAlgorithm = () => {
  var search = document.querySelector("#search input").value;

  for (var i = 0; i < Object.keys(people).length; i++) {
    if (people[i].name.toLowerCase().includes(search.toLowerCase())) {
      document.getElementById(people[i].name).style.display = "block";
    } else {
      document.getElementById(people[i].name).style.display = "none";
    }
  }
};

// prototip yap backend hazır olduğunda backendden alıp
//göster
