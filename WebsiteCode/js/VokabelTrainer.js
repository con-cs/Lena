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
    window.enterPressed_RunningLogic = true;

    let deutsch = getDeutschElement().innerText.trim();
    let grundform = getGrundformElement().value.trim();
    let simplePast = getSimplePastElement().value.trim();

    if ($('#okButton').hasClass('reloadButton')){
        window.location.reload();
        return;
    }

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
    updateStatistic();

    let alleAntworten = getCountAllAnswersThisRun();
    let gegebeneAntworten = getCountGivenAnswersThisRun();

    getCounterElements().verbraucht.innerText = gegebeneAntworten;

    if (alleAntworten == gegebeneAntworten) {
        window.config.count.leftAtAll ? allDone() : thisIsTheEnd();
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
    rememberThisWrongAnswer();

    playSound_falsch();

    arrayOfErrorElements.forEach(element => $(element).addClass('shaking'));
    window.setTimeout(function(){
        $('.shaking').removeClass('shaking');
        window.enterPressed_RunningLogic = false;
    }, 1000);

    arrayOfErrorElements[0].focus();
    arrayOfErrorElements[0].select();
}

function allDone(){
    getGrundformElement().value = "";
    getSimplePastElement().value = "";

    $('#progressContainer').css({height: '0%'}).removeClass("progress_start");

    confettiNow();

    playSound_geschafft();

    $('#okButton').addClass('restartButton');
}

function thisIsTheEnd(){
    getGrundformElement().value = "";
    getSimplePastElement().value = "";

    aLastSalutOfConfetti();
    playSound_geschafft();

    $('#okButton').addClass('reloadButton');
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
    window.enterPressed_RunningLogic = false;
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
    if (e.key == "Enter" && !window.enterPressed_RunningLogic) inputKeyEnter();
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

    window.config.vokabelListe.doneThisRun = [];
    window.config.count.triesPerRun = 0;
    window.config.count.run++;

    let perRun = window.config.count.perRun;
    let leftAtAll = window.config.count.leftAtAll;
    if(perRun > leftAtAll) {
        window.config.count.perRun = leftAtAll;
        getCounterElements().gesamt.innerText = leftAtAll;
    }

    updateStatistic();

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
