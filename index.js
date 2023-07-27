//Current settings
var repeated = 0;
var in_order = 0;
var in_book =0;
var cs_settings = {lang : "en-US", mute: "no", start: "off"};

const startBtn = document.querySelector("#phone-icon");

const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = cs_settings.lang;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const synth = window.speechSynthesis;

let utter = new SpeechSynthesisUtterance("Hi This is Mathew from China Garden. Would you like to order food or book a table ?");
let current_volume = 0.8;
utter.onend = () => {
    if ((cs_settings.start === "on") && (cs_settings.mute === "no"))
        recognition.start();
};

/* Bot reponses to the user interactively */
recognition.onresult = async (e) => {
    const transcript = e.results[e.results.length - 1][0].transcript.trim();

    recognition.stop();
    cs_settings.mute = "no";

    if (in_order >0) {
        switch(true) {
            case in_order === 1: utter.text = "Sure, how many " + transcript + " do you want?"; in_order = 2; break;
            case in_order === 2: utter.text = "May I know When you want to pick up? "; in_order = 3; break;
            case in_order === 3: utter.text = "what is your name please ?"; in_order = 4; break;
            case in_order === 4: utter.text = "Ok, I have taken your order. Thanks for ordering with us " + transcript + " !"; in_order = 0; 
            default: cs_settings.start = "off";
                    startBtn.style.backgroundColor = "white";
                    recognition.stop();
                    break;
        }
    }
    else
    if (in_book >0) {
        switch(true) {
            case in_book === 1: utter.text = "May I kow many people will dine with you ?"; in_book = 2; break;
            case in_book === 2: utter.text = "Could you please tell me when you want to come ? "; in_book = 3; break;
            case in_book === 3: utter.text = "What is your name please?"; in_book = 4; break;
            case in_book === 4: utter.text = "Ok, I have made a booking for you. Thanks for booking with us " + transcript + "!"; in_book = 0; 
            default: cs_settings.start = "off";
                    startBtn.style.backgroundColor = "white";
                    recognition.stop();
                    break;
        }

    }
    else {
    
     switch (true) {
        
        case transcript.indexOf("hello") > -1: 
        case transcript.indexOf("Hello") > -1: utter.text = "Hi, how are you?"; break;
        case transcript.indexOf("goodbye") > -1:
        case transcript.indexOf("Goodbye") > -1:    utter.text = "Hope to see you soon!"; 
                                                    cs_settings.start = "off";
                                                    startBtn.style.backgroundColor = "white";
                                                    recognition.stop();
                                                    break;
        case transcript.indexOf("something interesting") > -1:
        case transcript.indexOf("Something interesting") > -1: utter.text = "Have you heard about ChatGPT?"; break;
        case transcript.indexOf("groceries") > -1: utter.text = "Sure, what do we need to buy ? "; break;
        case transcript.indexOf("milk") > -1: utter.text = "Let's confirm 1 litre of milk, 1 pack of bread, and 2 cucumbers."; break;
        case transcript.indexOf("yes confirm") > -1:
        case transcript.indexOf("Yes, confirm") > -1:  utter.text = "Ok, got it."; break;
        case transcript.indexOf("lunch") > -1: utter.text = "Sure, what do you want for your lunch ? Noodle, burger, or fried rice. "; break;
        case transcript.indexOf("fish") > -1: utter.text = "Ok, I will get the fish soup noodle for you."; break;
        case transcript.indexOf("around 2:00") > -1:
        case transcript.indexOf("Around 2:00pm") > -1: utter.text = "Ok, I will make a booking to pick us at 2pm today. "; break;
        case transcript.indexOf("Club") > -1: utter.text = "Yes, what time do you want to go to Island Club?"; break;
        case transcript.indexOf("order") > -1:
        case transcript.indexOf("Order") > -1: utter.text = "Ok, which item do you want to order?"; in_order = 1; break;
        case transcript.indexOf("book") > -1:
        case transcript.indexOf("Book") > -1:utter.text = "Sure, which day would like like to book?"; in_book = 1; break;

        default: 
	        if (repeated === 0) {
		    repeated = 1;
		    utter.text = "sorry, could you repeat please ?"; 
	        }
            else {
                     const response = await fetch('https://mysql-api-zxm.onrender.com/google', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
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

                     cs_settings.start = "off";
                    startBtn.style.backgroundColor = "white";
                    recognition.stop();
           }
	    }
    }

    if (cs_settings.mute === "no") {
         synth.speak(utter);
         if (cs_settings.start === "off")
            utter.text = "Hi This is Mathew from China Garden. Would you like to order food or book a table ?";
        } else {
            utter.volume = 0;
            synth.speak(utter);
            utter.volume = current_volume;
        }
}

// Start/Stop button in main page
startBtn.addEventListener("click", () => {
    if (cs_settings.start === "off") {
        cs_settings.start = "on";
      //  startBtn.innerHTML = "Stop ";
        startBtn.style.backgroundColor = "red";
        synth.speak(utter);
        recognition.start();
        cs_settings.mute = "on";
      } else {
        cs_settings.start = "off";
     //   startBtn.innerHTML = "Start ";
        startBtn.style.backgroundColor = "white";
        recognition.stop();
      }
});
