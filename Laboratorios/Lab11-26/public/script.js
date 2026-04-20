document.addEventListener("DOMContentLoaded", function () {
    if (typeof M !== "undefined") {
        M.updateTextFields();
    }

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

    let passwordStrength = 0;

    if (passwordInput) {
        passwordInput.addEventListener("input", validatePassword);
        passwordInput.addEventListener("focus", function () {
            if (helpText) {
                helpText.style.position = "absolute";
                helpText.style.top = "6em";
                helpText.style.left = "7.5%";
                helpText.style.visibility = "visible";
            }
        });
        passwordInput.addEventListener("blur", function () {
            if (helpText) {
                helpText.style.visibility = "hidden";
            }
        });
    }
    if (confirmInput) {
        confirmInput.addEventListener("input", checkMatch);
    }
    if (title) {
        title.addEventListener("mouseover", function () {
            title.style.color = "#00ffff";
            title.style.fontStyle = "italic";
        });
        title.addEventListener("mouseout", function () {
            title.style.color = "white";
            title.style.fontStyle = "normal";
        });
    }

    function validatePassword() {
        const value = passwordInput.value;
        passwordStrength = 0;
        if (value.length >= 8) {
            if (lengthReq) lengthReq.style.color = "lime";
            passwordStrength++;
        } else {
            if (lengthReq) lengthReq.style.color = "#ff6b6b";
        }

        if (/[A-Z]/.test(value)) {
            if (upperReq) upperReq.style.color = "lime";
            passwordStrength++;
        } else {
            if (upperReq) upperReq.style.color = "#ff6b6b";
        }

        if (/[0-9]/.test(value)) {
            if (numberReq) numberReq.style.color = "lime";
            passwordStrength++;
        } else {
            if (numberReq) numberReq.style.color = "#ff6b6b";
        }

        if (/[^A-Za-z0-9]/.test(value)) {
            if (specialReq) specialReq.style.color = "lime";
            passwordStrength++;
        } else {
            if (specialReq) specialReq.style.color = "#ff6b6b";
        }
        updateStrengthBar(passwordStrength);
    }

    function updateStrengthBar(level) {
        if (!strengthBar) return;
        const percentage = (level / 4) * 100;
        strengthBar.style.width = percentage + "%";
        if (level === 1) {
            strengthBar.style.background = "red";
        } else if (level === 2) {
            strengthBar.style.background = "orange";
        } else if (level === 3) {
            strengthBar.style.background = "yellowgreen";
        } else if (level === 4) {
            strengthBar.style.background = "lime";
            showStrongMessage();
        } else {
            strengthBar.style.background = "transparent";
        }
    }

    function showStrongMessage() {
        if (!finalMessage) return;
        finalMessage.textContent = "Contraseña fuerte";
        finalMessage.style.color = "lime";

        setTimeout(function () {
            finalMessage.textContent = "";
        }, 3000);
    }

    function checkMatch() {
        if (!confirmInput || !matchMessage) return;
        if (confirmInput.value === "") {
            matchMessage.textContent = "";
            return;
        }
        if (confirmInput.value === passwordInput.value) {
            matchMessage.textContent = "Las contraseñas coinciden";
            matchMessage.style.color = "lime";
        } else {
            matchMessage.textContent = "Las contraseñas no coinciden";
            matchMessage.style.color = "red";
        }
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            if (
                passwordStrength === 4 &&
                confirmInput &&
                confirmInput.value === passwordInput.value &&
                confirmInput.value !== ""
            ) {
                if (title) {
                    title.textContent = "Enviando datos...";
                    title.style.color = "#00ffcc";
                }
            } else {
                event.preventDefault();
                if (finalMessage) {
                    finalMessage.textContent =
                        "Por favor cumple todos los requisitos";
                    finalMessage.style.color = "red";
                }
            }
        });
    }
});