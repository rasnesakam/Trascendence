var user = {
	id: 1,
	nickname: "ayumusak",
	username: 'ayumusak',
	name: 'Ahmet Kaan',
	surname: 'Yumuşakdiken',
	photo: 'static/assets/profile-photos/aydemir.jpg',

	total_time: 120,
	total_tournament: 3,
	total_match: 20,
	enemy: "emakas"
};

(function () {
  loadUserInformation();
})();

function loadUserInformation()
{
  document.getElementById("nickname").innerHTML = user.nickname;
  document.getElementById("pr-name").innerHTML = "Name: " + user.name;
  document.getElementById("pr-surname").innerHTML = "Surname: " + user.surname;
  document.getElementById("profile-photo").src = user.photo;
  
  document.getElementById("total_time").innerHTML = user.total_time + " Min";
  document.getElementById("total_tournament").innerHTML = user.total_tournament + " Tournament";
  document.getElementById("total_match").innerHTML = user.total_match + " Match";
  document.getElementById("enemy").innerHTML = user.enemy;
}

function saveUserInformation()
{
  user.nickname = document.getElementById("nicknameInput").value;
  //user.photo = document.getElementById("fileInput").files[0].path; // sunucu ile bağlamamız gerekiyor
  alert("file: " + user.photo);
  user.name = document.getElementById("nameInput").value;
  user.surname = document.getElementById("surnameInput").value;
  loadUserInformation();
  closeUpdateProfile();
  alert("oli");
}

function removeSubstring(originalString, substringToRemove) {
  return originalString.replace(substringToRemove, "");
}

const updateProfile = () => {
  document.getElementById("close-icon").style.display = "block";
  document.getElementById("setting-icon").style.display = "none";
  document.getElementById("save-icon").style.display = "block";
  document.getElementById("profile-photo").classList.add("darken-on-hover");
  document.getElementById("nickname").style.display = "none";
  document.getElementById("name").style.display = "none";
  document.getElementById("surname").style.display = "none";
  document.getElementById("information").style.display = "block";
  document.getElementById("questions").style.display = "block";

  document.getElementById("nicknameInput").value = user.nickname;
  document.getElementById("nameInput").value = user.name;
  document.getElementById("surnameInput").value = user.surname;



  document.getElementById("profile-photo").style.cursor = "pointer";
};

const closeUpdateProfile = () => {
  var profil_photo = document.getElementById("profile-photo");

  document.getElementById("close-icon").style.display = "none";
  document.getElementById("setting-icon").style.display = "block";
  document.getElementById("save-icon").style.display = "none";
  profil_photo.classList.remove("darken-on-hover");
  document.getElementById("nickname").style.display = "block";
  document.getElementById("name").style.display = "block";
  document.getElementById("surname").style.display = "block";
  document.getElementById("information").style.display = "none";
  document.getElementById("questions").style.display = "none";
  profil_photo.style.cursor = "default";
};

const clickOpcity = (section, othSection) =>
{
  let target = document.getElementById(section);
  let event = document.getElementById("under-" + section);
  let othTarget = document.getElementById(othSection);
  let othEvent = document.getElementById("under-" + othSection);

  target.style.cursor = "default";
  othTarget.style.cursor = "pointer";
  target.style.opacity = 0.6;
  othTarget.style.opacity = 1;
  event.style.display = "block";
  othEvent.style.display = "none";
}

//document.getElementById("rate").onclick = clickOpcity;

const changePhoto = () => {
  let control = document.getElementById("close-icon").style;
  if (control.display == "block") {
    document.getElementById("fileInput").click();
  }
};
