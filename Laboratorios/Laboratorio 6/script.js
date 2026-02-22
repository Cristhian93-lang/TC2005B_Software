const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const lengthReq = document.getElementById("lengthReq");
const upperReq = document.getElementById("upperReq");
const numberReq = document.getElementById("numberReq");
const specialReq = document.getElementById("specialReq");
const strengthBar = document.getElementById("strengthBar");
const matchMessage = document.getElementById("matchMessage");
const finalMessage = document.getElementById("finalMessage");
const helpText = document.getElementById("passwordHelp");
const title = document.getElementById("mainTitle");
const form = document.getElementById("registerForm");

passwordInput.addEventListener("input", validatePassword);
confirmInput.addEventListener("input", checkMatch);
passwordInput.addEventListener("focus", function() {
    helpText.style.visibility = "visible";
});

passwordInput.addEventListener("blur", function() {
    helpText.style.visibility = "hidden";
});

title.addEventListener("mouseover", function() {
    title.style.color = "#00ffff";
    title.style.fontStyle = "italic";
});

title.addEventListener("mouseover", function() {
    title.style.color = "white";
    title.style.fontStyle = "normal";
});

function validatePassword() {
    const value = passwordInput.value;
    let strength = 0;
    if (value.length >= 8) {
        lengthReq.style.color = "lime";
        strength++;
    } else {
        lengthReq.style.color = "#ff6b6b";
    }

    if (/[A-Z]/.test(value)) {
        upperReq.style.color = "lime";
        strength++;
    } else {
        upperReq.style.color = "#ff6b6b";
    }

    if (/[0-9]/.test(value)) {
        numberReq.style.color = "lime";
        strength++;
    } else {
        numberReq.style.color = "#ff6b6b";
    }

    if (/[^A-Za-z0-9]/.test(value)) {
        specialReq.style.color = "lime";
        strength++;
    } else {
        specialReq.style.color = "#ff6b6b"
    }
    updateStrengthBar(strength);
}

function updateStrengthBar(level) {
    const percentage = (level / 4) * 100;
    strengthBar.style.width = percentage + "%";
    if (level === 1) {
        strengthBar.style.background = "red";
    } else if (level === 2) {
        strengthBar.style.background = "orange";
    } else if (level === 3) {
        strengthBar.style.background = "lime";
        showStrongMessage();
    } else {
        strengthBar.style.background = "transparent";
    }
}

function showStrongMessage() {
    finalMessage.textContent = "Contraseña fuerte";
    finalMessage.style.color = "lime";
    setTimeout(function () {
        finalMessage.textContent = "";
    }, 3000);
}

function checkMatch() {
    if (confirmInput.value === "") {
        matchMessage.textContent = "";
        return;
    }
    if (confirmInput.value === passwordInput.value) {
        matchMessage.textContent = " Las contraseñas coinciden";
        matchMessage.style.color = "lime";
    } else {
        matchMessage.textContent = "Las contraseñas no coinciden";
        matchMessage.style.color = "red"
    }
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (strengthBar.style.width === "100%" && confirmInput.value === passwordInput) {
        finalMessage.textContent = "Cuenta creada exitosamente";
        finalMessage.style.color = "lime";    
    } else {
        finalMessage.textContent = "Por favor cumple todos los requisitos";
        finalMessage.style.color = "red";
    }
});