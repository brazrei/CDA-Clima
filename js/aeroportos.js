var arrAeroIndicativo = [];
var arrAeroLat = [];
var arrAeroLong = [];
var arrAeroDescricao = [];
var aeroportosOK = false;


function getAeroportos() {

    $.ajax({
        type: "GET",
        url: "files/aeroportos20102020.xml",
        dataType: "xml",
        origin: "http://smartmetar.com",

        error: function (e) {
            alert("An error occurred while processing XML file");
            console.log("XML reading Failed: ", e);
        },

        success: function (response) {

            // make sure the ul is empty
            // before appending data inot it

            arrAeroIndicativo.length = 0;
            arrAeroLat.length = 0;
            arrAeroLong.length = 0;
            arrAeroDescricao.length = 0;

            $(response).find("m").each(function () {
                var tit = $(this).find('t').text().split(" - ");


                var indicativo = tit[0];

                var desc = tit[1] + " - " + $(this).find('l').text()
                var latL = $(this).find('lt').text()
                var lat = Math.trunc(latL);
                var lngL = $(this).find('ln').text()
                var lng = Math.trunc(lngL);

                arrAeroIndicativo.push(indicativo);
                arrAeroLat.push(latL);
                arrAeroLong.push(lngL);
                arrAeroDescricao.push(desc);
            });
            aeroportosOK = true;
            loadFirBrasil();
            //BtnMetarGERALClick(true); // era chamado de dentro de relogio.js // achar uma solução mais bonita
        }
    });
}

function getLat(indicativo) {
    return Math.trunc(arrAeroLat[arrAeroIndicativo.indexOf(indicativo)]);
}

function getLng(indicativo) {
    return Math.trunc( arrAeroLong[arrAeroIndicativo.indexOf(indicativo)]);
}

function getLatL(indicativo) {
    return parseFloat(arrAeroLat[arrAeroIndicativo.indexOf(indicativo)]);
}

function getLngL(indicativo) {
    return parseFloat( arrAeroLong[arrAeroIndicativo.indexOf(indicativo)]);
}

function getLatStr(indicativo) {
    lat = arrAeroLat[arrAeroIndicativo.indexOf(indicativo)];
    if (lat <= 0)
        s = "S"
    else
        s = "N"
    return Math.abs(lat) + " °" + s;
}

function getLngStr(indicativo) {
    return Math.abs(arrAeroLong[arrAeroIndicativo.indexOf(indicativo)]) + " °W";
}

function getDescricao(indicativo) {
    return arrAeroDescricao[arrAeroIndicativo.indexOf(indicativo)];
}

