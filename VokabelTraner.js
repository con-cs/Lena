//#region GETTER
function getVokabeln(){
    let vokabeln = {
        gehen: {grundform: "go", simplePast: "went"},
        bringen: {grundform: "bring", simplePast: "brought"},
        fangen: {grundform: "catch", simplePast: "caught"},
        "aussuchen, (aus)wählen": {grundform: "choose", simplePast: "chose"},
        "machen; herstellen": {grundform: "make", simplePast: "made"},
        sagen: {grundform: "say", simplePast: "said"},
        sehen: {grundform: "see", simplePast: "saw"},
        "sitzen; sich setzen": {grundform: "sit", simplePast: "sat"},
        schwimmen: {grundform: "swim", simplePast: "swam"},
        "nehmen; bringen": {grundform: "take", simplePast: "took"},
        "denken, glauben": {grundform: "think", simplePast: "thought"},
        schreiben: {grundform: "write", simplePast: "wrote"},
        kommen: {grundform: "come", simplePast: "came"},
        "tun, machen": {grundform: "do", simplePast: "did"},
        fallen: {grundform: "fall", simplePast: "fell"},
        "fühlen; sich fühlen": {grundform: "feel", simplePast: "felt"},
        "bekommen; werden; gelangen, (hin)kommen": {grundform: "get", simplePast: "got"},
        haben: {grundform: "have", simplePast: "had"},
        // : {grundform: "", simplePast: ""},
    };

    return vokabeln;
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

function richtigeAntwort(antwort){
    feedbackToUser(":) Super :)");

    // delete this answer in backend. not to get it twice ;)
    delete vokabelListe[antwort];

    // set new vocabulary in frontend ..
    setRandomVocabulary();
    // .. and clean the input fields
    housekeeping();
}

function falscheAntwort(){
    feedbackToUser("Möööööööööööööööööp");
}
//#endregion LOGIC

//#region UserFeedback
function feedbackToUser(message){
    alert(message);
}
//#endregion UserFeedback

//#region SETTER
function housekeeping(){
    getGrundformElement().value = "";
    getSimplePastElement().value = "";
}

function setRandomVocabulary(){
    let vokabeln = Object.keys(vokabelListe);
    let randomZahl = Math.floor(Math.random() * 2);

    getDeutschElement().innerText = vokabeln[randomZahl];
}

function vokabelListeVorbereiten(){
    window.vokabelListe = getVokabeln();
}
//#endregion SETTER

//#region MAIN
function main(){
    vokabelListeVorbereiten();
    setRandomVocabulary();
}
//#endregion MAIN
