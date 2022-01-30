function getVokabeln(){
    let vokabeln = {
        gehen: {grundform: "go", simplePast: "went"},
        bringen: {grundform: "bring", simplePast: "brought"},
        fangen: {grundform: "catch", simplePast: "caught"},
        "aussuchen, (aus)wählen": {grundform: "choose", simplePast: "chose"},
        "machen; herstellen": {grundform: "make", simplePast: "made"},
        sagen: {grundform: "say", simplePast: "said"},
        : {grundform: "", simplePast: ""},
        : {grundform: "", simplePast: ""},
        : {grundform: "", simplePast: ""},
        : {grundform: "", simplePast: ""},
        : {grundform: "", simplePast: ""},
        : {grundform: "", simplePast: ""},
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

function main(){
    setRandomVocabulary();
}
