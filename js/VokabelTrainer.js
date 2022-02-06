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

function getCountAllAnswers(){
    let alleAntworten = parseInt(getCounterElements().gesamt.innerText);
    return alleAntworten;
}

function getCountGivenAnswers(){
    let gegebeneAntworten = parseInt(getCounterElements().verbraucht.innerText);
    return gegebeneAntworten;
}
//#endregion GETTER

//#region LOGIC
function check(){
    let deutsch = getDeutschElement().innerText;
    let grundform = getGrundformElement().value;
    let simplePast = getSimplePastElement().value;

    if ($('#okButton').hasClass('restartButton')){
        restart();
        return;
    }

    console.log(deutsch);
    console.log(grundform);
    console.log(simplePast);

    let lösung = vokabelListe[deutsch];
    console.log(lösung);

    if (grundform == lösung.grundform & simplePast == lösung.simplepast) {
        richtigeAntwort(deutsch);
    } else {
        let error = [];
        if (grundform != lösung.grundform) error.push(getGrundformElement());
        if (simplePast != lösung.simplepast) error.push(getSimplePastElement());

        falscheAntwort(error);
    }
}
//#endregion LOGIC

//#region Antworten: richtig/falsch/ende
function richtigeAntwort(antwort){
    // delete this answer in backend. not to get it twice ;)
    delete vokabelListe[antwort];
    correctAnswerAnimation(richtigeAntwort_Callback);
}

function richtigeAntwort_Callback(){
    let alleAntworten = getCountAllAnswers();
    let gegebeneAntworten = getCountGivenAnswers();
    gegebeneAntworten++;

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
}

function falscheAntwort(arrayOfErrorElements){
    playSound_falsch();

    arrayOfErrorElements.forEach(element => $(element).addClass('shaking'));
    window.setTimeout(function(){
        $('.shaking').removeClass('shaking');
    }, 1000);

    arrayOfErrorElements[0].focus();
    arrayOfErrorElements[0].select();
}

function allDone(){
    getSimplePastElement().value = "";
    getGrundformElement().value = "";

    confettiNow();

    playSound_geschafft();

    $('#okButton').addClass('restartButton');
}
//#endregion Antworten: richtig/falsch/ende

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
function restart(){
    $('#okButton').removeClass('restartButton');
    vokabelListeVorbereiten();
    setRandomVocabulary();
}

function main(){
    //getCSVData();
    restart();
    setEventHandler();
}
//#endregion MAIN
