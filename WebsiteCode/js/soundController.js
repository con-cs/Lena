function playSound_falsch(){
    playSound("falschSound");
}

function playSound_richtig(){
    playSound("richtigSound");
}

function playSound_geschafft(){
    playSound("endeSound");
}

function playSound(soundid){
    let sound = document.getElementById(soundid);
    sound.play();
}