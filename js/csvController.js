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