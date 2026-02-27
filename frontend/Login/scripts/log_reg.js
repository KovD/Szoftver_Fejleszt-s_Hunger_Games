let login = document.getElementById("login")
let register = document.getElementById("reg")

let login_see = true


function switchLogReg(){
    if(login_see){
        register.style.display = "flex"
        login.style.display = "none"
        login_see = false
    } else {
        register.style.display = "none"
        login.style.display = "flex"
        login_see = true
    }
}

function regPressed(){
    let inputs = document.querySelectorAll("#reg input");
    
    if (inputs[2].value !== inputs[3].value){
        alert("The passwords aren't matching!");
        return;
    } 
    
    const userData = {
        username: inputs[0].value,
        email: inputs[1].value,
        password: inputs[2].value
    };
    sendToServer(userData);
}

function sendToServer(data) {
    const payload = JSON.stringify(data);
    
    console.log("Szervernek küldendő csomag:", payload);

    /* HA KÉSZ A SZERVER, EZT A RÉSZT FOGOD HASZNÁLNI:
    fetch('https://a-te-szervered.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    })
    .then(response => {
        if(response.ok) {
            alert("Sikeres regisztráció!");
            switchLogReg(); // Visszaváltás loginra
        }
    })
    .catch(error => console.error("Hiba történt:", error));
    */

    // Ideiglenes visszaváltás, amíg nincs szerver:
    switchLogReg();
}

function logPressed() {
    let inputs = document.querySelectorAll("#login input");
    let isRemembered = document.getElementById("remember_me").checked;
    if (isRemembered) {
        localStorage.setItem("savedUsername", inputs[0].value);
        alert("Saved")
    } else {
        localStorage.removeItem("savedUsername");
    }


    const loginData = {
        username: inputs[0].value,
        password: inputs[1].value
    };
    
    sendLoginToServer(loginData);
}

function sendLoginToServer(data) {
    const payload = JSON.stringify(data);
    
    console.log("Szervernek küldendő bejelentkezési csomag:", payload);

    /* HA KÉSZ A SZERVER:
    fetch('https://a-te-szervered.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    })
    .then(response => {
        if(response.ok) {
            alert("Sikeres bejelentkezés!");
            // Átirányítás a főoldalra
        }
    })
    .catch(error => console.error("Hiba történt:", error));
    */
}

window.onload = () => {
    let savedName = localStorage.getItem("savedUsername");
    if (savedName) {
        document.querySelectorAll("#login input")[0].value = savedName;
        document.getElementById("remember_me").checked = true;
    }
};