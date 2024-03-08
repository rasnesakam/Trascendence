(function() {
    isPlayCode();
})

function saveUserInformation() {
    user.nickname = document.getElementById("nicknameInput").value;

    alert("file: " + user.photo);
    user.name = document.getElementById("nameInput").value;
    user.surname = document.getElementById("surnameInput").value;
    loadUserInformation();
    closeUpdateProfile();
    alert("save");
}

function removeSubstring(originalString, substringToRemove) {
    return originalString.replace(substringToRemove, "");
}

function updateProfile() {
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

function closeUpdateProfile() {
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

function clickOpcity(section, othSection) {
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
};

function changePhoto() {
    let control = document.getElementById("close-icon").style;
    if (control.display == "block") {
        document.getElementById("fileInput").click();
    }
};

function handleFileSelect() {
   
    var fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
        var file = document.getElementById("fileInput").files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(e) {
            console.log("target:" + e.target);
            document.getElementById("profile-photo").src = e.target.result;
        }
    } else {
        console.error("Please select file.");
    }
}

function isPlayCode()
{
    let data = JSON.parse(localStorage.getItem(0));

    if (data.play_code == undefined)
    {
        document.getElementById("play-code").click();
    }
}

function setPlayCode()
{
    let data = JSON.parse(localStorage.getItem(0));
    let playcode = document.getElementById("playcode-input").value;

    if (playcode != "")
    {
        data.play_code = playcode;
        localStorage.setItem(0, JSON.stringify(data));
    }
    else
    {
        document.getElementById("play-code").click();
        alert("Please enter play code");
    }
}
