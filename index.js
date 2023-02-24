const startBtn = document.querySelector("#start-btn");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

startBtn.addEventListener("click", () => {
    recognition.start();
});

let utter = new SpeechSynthesisUtterance("Hi, how are you?");
utter.onend = () => {
    recognition.start();    
};

/* Bot reponses to the user interactively */
recognition.onresult = (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();
    const messageArea = document.querySelector("#messages");
    const message1 = document.createElement("div");
    const message2 = document.createElement("div");
    message2.style.textAlign ="right";
    message2.style.backgroundColor ="#ddd";

    recognition.stop();
    message1.innerText="You:  "+ transcript; 
    message1.classList.add("container");
    messageArea.appendChild(message1);
    /*
    if (transcript === "hello") {
        message2.innerText = "Hi, How are you ? :XM";
        message2.classList.add("container");
        messageArea.appendChild(message2);

        utter.text = "Hi, how are you?";
        synth.speak(utter);
    } else if (transcript == "goodbye") {
        message2.innerText = "Hope to see you soon! :XM";
        message2.classList.add("container");
        messageArea.appendChild(message2);

        utter.text = "Hope to see you soon!";
        synth.speak(utter);
    } else {
        message2.innerText = "Sorry, I don't understand you. :XM";
        message2.classList.add("container");
        messageArea.appendChild(message2);

        utter.text = "Sorry, I don't understand you.";
        synth.speak(utter);
    }
    */

    switch (transcript) {
        case "hello": utter.text = "Hi, how are you?"; break;
        case "goodbye": utter.text = "Hope to see you soon!"; break;
        case "something interesting": utter.text = "Have you heard about ChatGPT?"; break;
        default: utter.text = "Sorry, I don't understand you. I am still learning."; 
     }

     message2.innerText = utter.text + " :XM";
     message2.classList.add("container");
     messageArea.appendChild(message2);
     synth.speak(utter);



    /* Always scroll to the latest*/
    messageArea.scrollTop = messageArea.scrollHeight;

};