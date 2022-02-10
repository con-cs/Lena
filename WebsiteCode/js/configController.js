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
            run: 0,
            all: Object.keys(vokabelListe).length,
            donePerRun: 0,
            leftPerRun: answersToGivePerRun,
            doneAtAll: 0,
            leftAtAll: Object.keys(vokabelListe).length,
            triesPerRun: 0,
            triesAtAll: 0
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

function updateStatistic(){
    refreshCountingConfig();

    let statistic = $('#statistic');
    statistic.find('#tries').text(window.config.count.triesAtAll);
    statistic.find('#tries_right').text(window.config.vokabelListe.done.length);
    statistic.find('#tries_wrong').text(window.config.count.triesAtAll - window.config.vokabelListe.done.length);
    statistic.find('#run').text(window.config.count.triesPerRun);
    statistic.find('#run_right').text(window.config.count.donePerRun);
    statistic.find('#run_wrong').text(window.config.count.triesPerRun - window.config.count.donePerRun);
    statistic.find('#level').text(window.config.count.run);
    statistic.find('#atall').text(window.config.count.all);
    statistic.find('#leftatall').text(window.config.count.all - window.config.vokabelListe.done.length);
}

function rememberThisWrongAnswer(){
    window.config.count.triesPerRun++;
    window.config.count.triesAtAll++;

    updateStatistic();
}

function rememberThisCorrectAnswer(answer){
    let givenAnswer = {};
    givenAnswer[answer] = window.config.vokabelListe.modified[answer];
    window.config.vokabelListe.done.push(answer);
    window.config.vokabelListe.doneThisRun.push(answer);

    window.config.count.triesPerRun++;
    window.config.count.triesAtAll++;

    // delete this answer in backend. not to get it twice ;)
    delete window.config.vokabelListe.modified[answer];
}