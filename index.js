// main page
const loginButton = document.getElementById("xm_login_menu");
const voiceButton = document.getElementById("xm_voice_menu");
const chatButton = document.getElementById("xm_mute_menu");
const langButton = document.getElementById("xm_lang_menu");

// login page
const loginButton1 = document.getElementById("login_button");

// voice page
const backButton = document.getElementById("xm_chat_menu");

// user and password
var uname =   'user';
var passwd = 'test';
var listen = 0;

//Current settings
var cs_settings = {lang : "en-US", mute: "no", start: "off"};

const startBtn = document.querySelector("#start-btn");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = cs_settings.lang;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

let utter = new SpeechSynthesisUtterance("Hi, how are you?");
utter.onend = () => {
    if (document.getElementById("xm-chat").style.display != "none") {
        if (listen === 0) {
            recognition.start();
            listen = 1;
        }
    }    
};

/* Bot reponses to the user interactively */
recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    const messageArea = document.querySelector("#messages");
    const message1 = document.createElement("div");
    const message2 = document.createElement("div");
    message2.style.textAlign ="right";
    message2.style.backgroundColor ="#ddd";

    recognition.stop();
    listen = 0;
    message1.innerText="You:  "+ transcript; 
    message1.classList.add("container");
    messageArea.appendChild(message1);

    switch (true) {
        case transcript.indexOf("hello") > -1: 
        case transcript.indexOf("Hello") > -1: utter.text = "Hi, how are you?"; break;
        case transcript.indexOf("goodbye") > -1:
        case transcript.indexOf("Goodbye") > -1: utter.text = "Hope to see you soon!"; break;
        case transcript.indexOf("something interesting") > -1:
        case transcript.indexOf("Something interesting") > -1: utter.text = "Have you heard about ChatGPT?"; break;
        case transcript.indexOf("logo") > -1:
        case transcript.indexOf("Logo") > -1: utter.text = "The following is our brand: "; break;
        case transcript.indexOf("share") > -1:
        case transcript.indexOf("Share") > -1: utter.text = " The following is our planned share structure: "; break;
        case transcript.indexOf("Balance sheet") > -1:
        case transcript.indexOf("balance sheet") > -1: utter.text = "The following is our estimation of balance sheet in 5 years: "; break;
        default: 
            const response = await fetch('https://biosycle-chat.onrender.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                usr: uname,
                passd: passwd,
                prompt: transcript
                })
            })
            if (response.ok) {
                const data = await response.json();
                const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
                utter.text = parsedData;
            } else {
                    utter.text = "Sorry, I don't understand you. I am still learning.";
            }
    }

    message2.innerText = utter.text + " :XM";
    message2.classList.add("container");
    messageArea.appendChild(message2);
    
    if (cs_settings.mute === "no") {
        synth.speak(utter);
    } else {
        if (listen === 0) {
            recognition.start();
            listen = 1;
        }
    }

    if (transcript.indexOf("logo") > -1) {
       const img = document.createElement("img");
       img.src = "assets/BioSycle_logo.jpg";
       messageArea.appendChild(img);
    } else if (transcript.indexOf("share") > -1) {
       const img = document.createElement("img");
       img.src = "assets/shares.jpg";
       messageArea.appendChild(img);
    } else if (transcript.indexOf("balance sheet") > -1) {
       const img = document.createElement("img");
       img.src = "assets/balance.jpg";
       messageArea.appendChild(img);
    }

    /* Always scroll to the latest*/
    messageArea.scrollTop = messageArea.scrollHeight;
};

/*====================================================================================
============================= Select Voice =========================================*/

let voices = [];
window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
  utter.voice = voices[0];
  let voiceSelect = document.querySelector("#v_voices");
  voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

document.querySelector("#v_rate").addEventListener("input", () => {
  const rate = document.querySelector("#v_rate").value;
  utter.rate = rate;
  document.querySelector("#rate-label").innerHTML = rate;
});

document.querySelector("#v_volume").addEventListener("input", () => {
  const volume = document.querySelector("#v_volume").value;
  utter.volume = volume;
  document.querySelector("#volume-label").innerHTML = volume;
});

document.querySelector("#v_pitch").addEventListener("input", () => {
  const pitch = document.querySelector("#v_pitch").value;
  utter.pitch = pitch;
  document.querySelector("#pitch-label").innerHTML = pitch;
});

document.querySelector("#v_voices").addEventListener("change", () => {
  utter.voice = voices[document.querySelector("#v_voices").value];
});

document.querySelector("#v_start").addEventListener("click", () => {
  utter.text = document.querySelector("#trytext").value;
  window.speechSynthesis.speak(utter);
});

document.querySelector("#v_pause").addEventListener("click", () => {
  window.speechSynthesis.pause();
});

document.querySelector("#v_resume").addEventListener("click", () => {
  window.speechSynthesis.resume();
});

document.querySelector("#v_cancel").addEventListener("click", () => {
  window.speechSynthesis.cancel();
});

/*==================== Login page ==================================*/

loginButton1.addEventListener("click", (e) => {
    e.preventDefault();
    const username = document.getElementById("username-field").value;
    const password = document.getElementById("password-field").value;
  
    alert("The assistant will response only if the credential is valid.");

    uname = username;
    passwd = password;
  
    document.getElementById("login-try").style.display = "none";
    document.getElementById("xm-chat").style.display = "inline";
  
  })

/*==================== switch between pages ==========================*/

voiceButton.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("xm-voice").style.display = "inline";
    document.getElementById("xm-chat").style.display = "none";
    document.getElementById("login-try").style.display = "none";
    
})

loginButton.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("xm-voice").style.display = "none";
    document.getElementById("xm-chat").style.display = "none";
    document.getElementById("login-try").style.display = "inline";
})

backButton.addEventListener("click", (e) => {
    e.preventDefault();

    document.getElementById("xm-voice").style.display = "none";
    document.getElementById("xm-chat").style.display = "inline";
    document.getElementById("login-try").style.display = "none";
})

// Start/Stop button in main page
startBtn.addEventListener("click", () => {
    if (cs_settings.start === "off") {
        cs_settings.start = "on";
        startBtn.innerHTML = "Stop ";
        startBtn.style.backgroundColor = "red";
        recognition.start();
        listen = 1;
      } else {
        cs_settings.start = "off";
        startBtn.innerHTML = "Start ";
        startBtn.style.backgroundColor = "lightseagreen";
        recognition.stop();
        listen = 0;
      }
});

// Mute button in main page
chatButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (cs_settings.mute === "no") {
      cs_settings.mute = "yes";
      chatButton.innerHTML = "Muted";
    } else {
      cs_settings.mute = "no";
      chatButton.innerHTML = "Mute";
    }
})

// Language button in the main page
langButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (cs_settings.lang === "en-US") {
      cs_settings.lang = "zh-CN";
      langButton.innerHTML = "Eng  ";
    } else {
      cs_settings.lang = "en-US";
      langButton.innerHTML = "Chn  ";
    }
    recognition.lang = cs_settings.lang;
    synth.lang = cs_settings.lang;
})