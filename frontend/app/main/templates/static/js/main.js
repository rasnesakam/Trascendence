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
        reader.onloadend = function (e) {
            console.log("target:" + e.target);
            document.getElementById("profile-photo").src = e.target.result;
        }
    } else {
        console.error("Please select file.");
    }
}

function setMatches(matches, username) {
    let added = document.getElementById("matchList");
    added.innerHTML = "";
    console.log("matches: ", matches);
    if (matches == undefined) return;
    for (let i = 0; i < matches.length; i++) {
        let li = document.createElement("li");
        li.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );
        added.appendChild(li);

        let span1 = document.createElement("span");
        span1.textContent = matches.home + " - " + matches.score; //maçta oynayan kişiler
        li.appendChild(span1);

        let span2 = document.createElement("span");
        span2.textContent = matches.score_home + " - " + matches.score_away; //maç scorları
        li.appendChild(span2);

        if (matches.matches.score_home > matches.score_away)
            if (matches.home == username) li.classList.add("bg-success");
            else li.classList.add("bg-danger");
        else if (matches.away == username) li.classList.add("bg-success");
        else li.classList.add("bg-danger");
    }
}
