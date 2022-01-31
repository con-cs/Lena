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
    feedbackToUser(":) Super :)");

    // delete this answer in backend. not to get it twice ;)
    delete vokabelListe[antwort];

    let bisherigeAntworten = getCounterElements().verbraucht.innerText;
    getCounterElements().verbraucht.innerText = parseInt(bisherigeAntworten) + 1;

    // set new vocabulary in frontend ..
    setRandomVocabulary();
    // .. and clean the input fields
    housekeeping();
}

function falscheAntwort(){
    let sound = document.getElementById("falschSound");
    sound.play();

    feedbackToUser("Möööööööööööööööööp");
}

function feedbackToUser(message){
    //alert(message);
}
//#endregion UserFeedback

//#region SETTER
function housekeeping(){
    getSimplePastElement().value = "";
    getGrundformElement().value = "";
    getGrundformElement().focus();
    getGrundformElement().select();
}

function setRandomVocabulary(){
    let vokabeln = Object.keys(vokabelListe);
    let randomZahl = Math.floor(Math.random() * vokabeln.length);

    getDeutschElement().innerText = vokabeln[randomZahl];
}

function vokabelListeVorbereiten(){
    housekeeping();

    window.vokabelListe = getVokabeln();
    getCounterElements().gesamt.innerText = Object.keys(window.vokabelListe).length;
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
