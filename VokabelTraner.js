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
    console.log(lösung);

    if (grundform == lösung.grundform & (simplePast == lösung.simplePast || simplePast == lösung.simplepast)) {
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
            setOffsetPath();

            $('#deutsch').addClass('motionBall motionBallOffsetPath');
            window.setTimeout(function(){
                let sound = document.getElementById("richtigSound");
                sound.play();

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

    let sound = document.getElementById("endeSound");
    sound.play();
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
function setOffsetPath(){
    let source = document.getElementById('deutsch');
    let target = document.getElementById('auswertung');
    let distanceLeft = target.offsetLeft + target.offsetWidth/2 - source.offsetLeft;
    let distanceTop = target.offsetTop + target.offsetHeight/2 - source.offsetTop;

    let style = `<style id="dynamicStyle">
        .motionBallOffsetPath {
            offset-path: path('M57,9 C42,9 ${distanceLeft*0.75},8 ${distanceLeft*0.75},9 C${distanceLeft-10},11 ${distanceLeft-10},29 ${distanceLeft},${distanceTop}');
        }
    </style>`;
    $('head').append(style);
}

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

    if(document.getElementById("dynamicStyle")) document.getElementById("dynamicStyle").remove();
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
function getVokabelnCSV(){
    if (window.vokabelListe) return window.vokabelListe;

    let data = window.vokabelListe_raw;
    let vokabelListe = {};
    let position, header, properties;
    let identifierAttribute = "deutsch";

    data.forEach(entry => {
        if (!header){
            // first row, init variables
            header = entry.map(a => a.toLowerCase());
            properties = header.filter(a => a !== identifierAttribute.toLowerCase());
            position = {};
            header.forEach((element, index) => position[element] = index);
        } else {
            let key = entry[position[identifierAttribute]];
            if (key) {
                vokabelListe[key] = {};
                properties.forEach(property => vokabelListe[key][property] = entry[position[property]]);
            }
        }
    });

    return vokabelListe;
}

function getCSVData(){
    $.ajax({
        type: "GET",
        url: "https://schulte-page.de/Vokabeltrainer/vokabeln.csv",
        dataType: "text",
        success: function(data) {
            var results = Papa.parse(data);
            window.vokabelListe_raw = results.data;
            console.log(results);

            restart();
        }
    });
}

function main(){
    //getCSVData();
    restart();
    setEventHandler();
}
//#endregion MAIN
