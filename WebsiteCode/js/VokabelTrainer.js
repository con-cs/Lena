//#region CONFIG
function setConfig(vokabelListe){
    let answersToGivePerRun = 10;
    window.config = {
        vokabelListe: {
            original: JSON.parse(JSON.stringify(vokabelListe)),
            modified: JSON.parse(JSON.stringify(vokabelListe)),
            done: [],
            doneThisRun: []
        },
        count: {
            perRun: answersToGivePerRun,
            all: Object.keys(vokabelListe).length,
            donePerRun: 0,
            leftPerRun: answersToGivePerRun,
            doneAtAll: 0,
            leftAtAll: Object.keys(vokabelListe).length
        }
    }
}

function refreshCountingConfig(){
    let all = Object.keys(window.config.vokabelListe.original).length;
    let doneAtAll = window.config.vokabelListe.done.length;
    let given = window.config.vokabelListe.doneThisRun.length;
    let toGive = window.config.count.perRun;

    window.config.count.donePerRun = given;
    window.config.count.leftPerRun = toGive - given;
    window.config.count.doneAtAll = doneAtAll;
    window.config.count.leftAtAll = all - doneAtAll;
}

function rememberThisCorrectAnswer(answer){
    let givenAnswer = {};
    givenAnswer[answer] = window.config.vokabelListe.modified[answer];
    window.config.vokabelListe.done.push(answer);
    window.config.vokabelListe.doneThisRun.push(answer);

    // delete this answer in backend. not to get it twice ;)
    delete window.config.vokabelListe.modified[answer];

    refreshCountingConfig();
}
//#endregion CONFIG

//#region GETTER
function getCountAllAnswersThisRun(){
    return window.config.count.perRun;
}

function getCountGivenAnswersThisRun(){
    return window.config.count.donePerRun;
}

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
    let deutsch = getDeutschElement().innerText.trim();
    let grundform = getGrundformElement().value.trim();
    let simplePast = getSimplePastElement().value.trim();

    if ($('#okButton').hasClass('restartButton')){
        restart();
        return;
    }

    console.log(deutsch);
    console.log(grundform);
    console.log(simplePast);

    let lösung = window.config.vokabelListe.original[deutsch];
    console.log(lösung);

    if (grundform == lösung.grundform.trim() & simplePast == lösung.simplepast.trim()) {
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
    rememberThisCorrectAnswer(antwort);

    correctAnswerAnimation(richtigeAntwort_Callback);
}

function richtigeAntwort_Callback(){
    let alleAntworten = getCountAllAnswersThisRun();
    let gegebeneAntworten = getCountGivenAnswersThisRun();

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
    window.config.vokabelListe.doneThisRun = [];

    confettiNow();

    playSound_geschafft();

    $('#okButton').addClass('restartButton');
}
//#endregion Antworten: richtig/falsch/ende

//#region SETTER
function housekeeping(){
    getSimplePastElement().value = "";
    getGrundformElement().value = "";

    document.getElementById("auswertungContainer").className = "rainbow";

    if(document.getElementById("dynamicStyle")) document.getElementById("dynamicStyle").remove();
}

function setRandomVocabulary(){
    let vokabeln = Object.keys(window.config.vokabelListe.modified);
    let randomZahl = Math.floor(Math.random() * vokabeln.length);

    setCursorToElement(getGrundformElement());

    document.getElementById("deutsch").className = "";
    document.getElementById("deutsch").style.overflow = "auto";
    document.getElementById("deutsch").style.width = "";
    document.getElementById("deutsch").style.height = "";
    document.getElementById("deutsch").style.display = "inline-block";

    getDeutschElement().innerText = vokabeln[randomZahl];
}

function vokabelListeVorbereiten(max){
    setConfig(getVokabeln());

    housekeeping();

    if (!max) max = window.config.count.perRun;
    let all = Object.keys(window.config.vokabelListe.modified).length;

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

    $('#progressContainer').css({height: '100%'}).addClass("progress_start");
    getCounterElements().verbraucht.innerText = "0";

    setRandomVocabulary();
}

function main(){
    //getCSVData();
    vokabelListeVorbereiten();
    restart();
    setEventHandler();
}
//#endregion MAIN