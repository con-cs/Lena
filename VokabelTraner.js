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
    let deutsch = getDeutschElement();
    let grundform = getGrundformElement();
    let simplePast = getSimplePastElement();

    console.log(deutsch.innerText);
    console.log(grundform.value);
    console.log(simplePast.value);

    let lösung = getVokabeln()[deutsch.innerText];
    if (grundform.value == lösung.grundform & simplePast.value == lösung.simplePast) {
        alert(":) Super :)");
        setRandomVocabulary();
        housekeeping();
    } else {
        alert("Möööööööööööööööööp");
    }
}
//#endregion LOGIC

//#region SETTER
function housekeeping(){
    getGrundformElement().value = "";
    getSimplePastElement().value = "";
}

function setRandomVocabulary(){
    let vokabeln = getVokabeln();
    let vokabelListe = Object.keys(vokabeln);
    let randomZahl = Math.floor(Math.random() * 2);

    getDeutschElement().innerText = vokabelListe[randomZahl];
}
//#endregion SETTER

//#region MAIN
function main(){
    setRandomVocabulary();
}
//#endregion MAIN
