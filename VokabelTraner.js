//#region GETTER
function getDeutschElement(){
    return document.getElementById("deutsch");
}

function getGrundformElement(){
    return document.getElementById("grundform");
}

function getSimplePastElement(){
    return document.getElementById("simplePast");
}

function getCounterElements(){
    return {
        verbraucht: document.getElementById("verbraucht"),
        gesamt: document.getElementById("gesamtzahl")
    };
}
//#endregion GETTER

//#region LOGIC
function check(){
    let deutsch = getDeutschElement().innerText;
    let grundform = getGrundformElement().value;
    let simplePast = getSimplePastElement().value;

    console.log(deutsch);
    console.log(grundform);
    console.log(simplePast);

    let lösung = vokabelListe[deutsch];
    if (grundform == lösung.grundform & simplePast == lösung.simplePast) {
        richtigeAntwort(deutsch);
    } else {
        falscheAntwort();
    }
}
//#endregion LOGIC

//#region UserFeedback
function richtigeAntwort(antwort){
    // delete this answer in backend. not to get it twice ;)
    delete vokabelListe[antwort];

    let alleAntworten = parseInt(getCounterElements().gesamt.innerText);
    let gegebeneAntworten = parseInt(getCounterElements().verbraucht.innerText);
    gegebeneAntworten++;

    $("#deutsch")
        .css({overflow: "hidden"})
        .animate({width: "1em", height: "1em"}, 200, function() {
            // animate rolling to the box - animation duration 600ms
            $('#deutsch').addClass('motionBall');
            window.setTimeout(function(){
                // start shaking the box - animation duration 600 ms
                $("#auswertungContainer").addClass("bounce-7");
                window.setTimeout(function(){
                    // hide the ball in the box
                    $('#deutsch').fadeOut();
                    getCounterElements().verbraucht.innerText = gegebeneAntworten;

                    if (alleAntworten == gegebeneAntworten) {
                        allDone();
                        return;
                    }

                    window.setTimeout(function(){
                        // animation end
                        // set new vocabulary in frontend ..
                        setRandomVocabulary();
                        // .. and clean the input fields
                        housekeeping();
                    }, 550);
                }, 200);
            }, 500);
            // Animation complete.
        }
    );
}

function falscheAntwort(){
    let sound = document.getElementById("falschSound");
    sound.play();
}

function allDone(){
    // $('img').addClass("spin");
    // window.setTimeout(function(){
    //     $('img').remveClass("spin");
    // }, 2000);

    getSimplePastElement().value = "";
    getGrundformElement().value = "";

    feedbackToUser(":) Super :)");
}

function restart(){
    vokabelListeVorbereiten();
    setRandomVocabulary();
}

function confettiNow(){
    let end = Date.now() + (3 * 1000);
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
}

function feedbackToUser(message){
    alert(message);
    confettiNow();
}
//#endregion UserFeedback

//#region SETTER
function housekeeping(){
    getSimplePastElement().value = "";
    getGrundformElement().value = "";

    getGrundformElement().focus();
    getGrundformElement().select();

    document.getElementById("auswertungContainer").className = "";
    document.getElementById("deutsch").className = "";
    document.getElementById("deutsch").style.overflow = "auto";
    document.getElementById("deutsch").style.width = "";
    document.getElementById("deutsch").style.height = "";
    document.getElementById("deutsch").style.display = "inline-block";
}

function setRandomVocabulary(){
    let vokabeln = Object.keys(vokabelListe);
    let randomZahl = Math.floor(Math.random() * vokabeln.length);

    getDeutschElement().innerText = vokabeln[randomZahl];
}

function vokabelListeVorbereiten(max){
    window.vokabelListe = getVokabeln();

    housekeeping();
    if (!max) max = 10;
    let all = Object.keys(window.vokabelListe).length;

    getCounterElements().gesamt.innerText =  all < max ? all : max;
    getCounterElements().verbraucht.innerText = "0";
}
//#endregion SETTER

//#region EventHandler
function setEventHandler(){
    let allInputs = document.getElementsByTagName('input');
    for (input of allInputs){
        input.onkeydown = inputKeyDown;
    }
}

function inputKeyDown(e){
    if (e.key == "Enter") inputKeyEnter();
}

function inputKeyEnter(){
    let textInGrundform = checkTextInElement( getGrundformElement() );
    if (!textInGrundform) return;

    let textInSimplePast = checkTextInElement( getSimplePastElement() );
    if (!textInSimplePast) return;

    check();
}

function checkTextInElement(element){
    if (element.value.length === 0){
        setCursorToElement(element);
        return false;
    }

    return true;
}

function setCursorToElement(element){
    element.focus();
    element.select();
}
//#endregion EventHandler

//#region MAIN
function main(){
    vokabelListeVorbereiten();
    setRandomVocabulary();
    setEventHandler();
}
//#endregion MAIN
