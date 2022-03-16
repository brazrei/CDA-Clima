var TipoConsulta, oldResponse;
var smartPlotOnline = false
var TempoCorrido;
var arrayTableFir = ["firAZtable", "firBStable", "firREtable", "firCWtable"];
var globalVisMax = 5000;
var globalVentoMax = 14;
var globalStrMetaresOffLine = ["", "", "", ""]; //usado para carregar os metares localmente quando se mudam os filtros
var firVisible = [true, true, true, true];
var metaresFiltrados = []; //usado para controlar os metares que estão em exibição 
var arrMetaresFiltrados = []; //usado para controlar os metares que estão em exibição 
var arrRestricaoLoc = []
var escondeSpeciAUTO = true;
var primeiraVez = true; //usada para nao marcar os metares na 1 exibicao
const toleranciaRajada = 20; // percenual de tolerancia para alerta de rajada

var redemetAntiga = true;
var OPMET = true;
var intraer = false; // valido apenas para a api antiga por enquanto
var apiKey = "U9Q2PoK6e5uhykrMXrsrGAQssG8htAnPIqXsxmei"
//var linkInternet = "http://redemet.decea.gov.br//api/consulta_automatica/index.php?local="
var linkInternet = "http://localhost/WebServiceOPMET/getMetarOPMET.php?local="

var linkIntraer = "http://www.redemet.intraer//api/consulta_automatica/index.php?local="
var linkAPINova = "https://api-redemet.decea.mil.br/mensagens/"

const urlCache = "php/consulta_msg.php?url="
const proxy = "&proxy=true"

//var beepOn = true; //

var localidadesFIR = [
    "SBEG,SBMN,SBBV,SBPV,SBRB,SBCY,SBSL,SBBE,SBJC,SBSN,SBMQ,SBCZ,SBTF,SBMY,SBAT,SBUA,SBCC,SBSO,SBIH,SBTT,SBTK,SBJI,SBHT,SBMA,SBVH,SBTU,SBOI,SBCJ,SBCI,SBIZ,SBTS,SBTB,SBUY,SBIC,SBEK,SBGM,SBMD,SBAA,SBRD,SSKW,SBSI",
    "SBAN, SBBH, SBBR, SBBW, SBCF, SBCN, SBGO, SBIP, SBIT, SBLS, SBMK, SBNV, SBPJ, SBPR, SBYS, SBAQ, SBAX, SBBP, SBGP, SBJD, SBKP,SBSJ, SBPC, SBRP, SBSR, SBUL, SBUR, SBVG, SNDV, SDAM, SWLC,SBML,SBBU,SBAE,SBAU",
    "SBFZ, SBSG, SBNT, SBJP, SBKG, SBRF, SBMO, SBAR, SBPL, SBJU, SBSV, SBIL, SBPS, SBVC, SBLP, SBVT, SBTE, SBFN, SBPB, SBGV, SBMS, SBUF, SBLE, SBTC, SBFE,SBTV,SBAC,SBJE,SNBR,SNTF,SDIY,SNVB,SNHS",
    "SAEZ,SUMU,SGAS,SARE,SBUG,SBBG,SBPK,SBSM,SBNM,SBPF,SBPA,SBCO,SBCX,SBTR,SBCM,SBJA,SBLJ,SBCH,SBCD,SBFL,SBNF,SBJV,SBCT,SBBI,SBFI,SBPG,SSGG,SBPO,SBCA,SBTD,SBPP,SBDB,SBDO,SBCG,SBCR,SBTG,SBMG,SBLO,SBDN,SBSP,SBMT,SBGR,SBST,SBTA,SBGW,SBSC,SBJR,SBAF,SBRJ,SBGL,SBBQ,SBZM,SBJF,SBES,SBBZ,SBCB,SBME,SBMM,SBEC,SBLB,SBCP,SBFS,SBEN,SDAG,SBMI,SBGU,SDCO,SBJH"
];

var arrayCMA = [
    "SBEG = SBAA SBAT SBBE SBBV SBCC SBCI SBCY SBCZ SBCJ SBEG SBEK SBGM SBHT SBIC SBIH SBIZ SBJC SBJI SBMA SBMD SBMN SBMY SBMQ SBOI SBPV SBRB SBRD SBSI SBSL SBSN SBSO SBTB SBTF SBTS SBTT SBTU SBUA SBUY SBVH",
    "SBBR = SBAN SBBH SBBR SBBW SBCF SBCN SBGO SBIP SBIT SBLS SBMK SBNV SBPJ SBPR SBYS SWLC",
    "SBRF = SBAC SBAR SBFN SBFZ SBGV SBIL SBJE SBJP SBJU SBKG SBLE SBLP SBMO SBMS SBNT SBPB SBPL SBPS SBQV SBRF SBSG SBSV SBTC SBTE SBTV SBVC SBVT SDIY SNBR SNTF SNVB",
    "SBPA = SBAE SBAF SBAU SBBG SBBI SBBU SBCA SBCD SBCG SBCH SBCO SBCR SBCT SBCX SBDB SBDN SBDO SBFI SBFL SBGU SBGW SBJA SBJV SBLJ SBLO SBMG SBML SBNF SBNM SBPA SBPF SBPG SBPK SBPO SBPP SBSC SBSM SBTD SDCO SBTG SBUG SSGG",
    "SBGL = SBBQ SBCB SBCP SBEC SBES SBFS SBGL SBJF SBJR SBLB SBME SBMI SBMM SBRJ SBSJ SBST SBTA SBZM SBEN",
    "SBGR = SBAQ SBAX SBBP SBGP SBGR SBJD SBKP SBMT SBPC SBRP SBSP SBSR SBUL SBUR SBVG SBJH SDAM"]

//Global ciclos, MaxCiclos As integer  ' É 1 CICLO POR SEGUNDO

function addHours(data, horas) {
    if (!Date.prototype.addHours)
        Date.prototype.addHours = function (h) {
            this.setHours(this.getHours() + h);
            return this;
        }

    return data.addHours(horas)

}

function getFormatedDate(data) {
    let ano = data.getUTCFullYear();
    let mes = fillZero(parseInt(data.getUTCMonth()) + 1);
    let dia = fillZero(data.getUTCDate());
    let hora = fillZero(data.getUTCHours());
    //    let minutos = addZeros(data.getUTCMinutes());
    let minutos = "";
    //    if (zeraMinutos)
    //        minutos = '00';
    return `${ano}${mes}${dia}${hora}${minutos}`;
}

function getInterval(horas = 1) {
    let dini = getFormatedDate(addHours(new Date(), -horas));
    let dfim = getFormatedDate(addHours(new Date(), 1));
    return `&data_ini=${dini}&data_fim=${dfim}`
}

function getUrlCache() {
    return urlCache;
}

function getProxy() {
    return proxy;
}

function GetWebContent(url, idxFIR) {
    function codeUrl(url) {
        return url;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        var erro = "ErroSM=";
        if (this.status > 0) {
            if (this.readyState == 4 && this.status == 200) {
                if (!this.responseText.includes("METAR")) {
                    $("#imgLoad" + idxFIR).attr('src', 'pngs/red-button30.png');
                    trataMetarRedemet(erro + " Resposta vazia so Servidor!", idxFIR);
                }
                else {
                    $("#imgLoad" + idxFIR).attr('src', 'pngs/green-button30.png');
                    trataMetarRedemet(this.responseText, idxFIR);
                }

                //return this.responseText;
            } else if (this.readyState > 2 && this.status !== 200) {
                erro = erro + this.responseText;
                $("#imgLoad" + idxFIR).attr('src', 'pngs/red-button30.png');

                trataMetarRedemet(erro, idxFIR);
                //return erro;
            }

        }
    };

    const params = {
        url: codeUrl(url),
    }

    $(".imgLoad").attr('src', 'gifs/loading30x30.gif');
    $("#imgLoad" + idxFIR).attr('src', 'pngs/red-button30.png');
    xhttp.open('GET', urlCache + params.url + proxy, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    //xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send();
}

function getCortante(metar) {
    return metar.includes(' WS ');
}

function getTrovoada(metar) {
    metar = metar.replace(/RETS/g,"");
    return metar.includes(" TS ") || metar.includes("TSRA ") || metar.includes("TSGR ") || metar.includes("TSGRRA ") || metar.includes("TSRAGR ");
}

function getTeto(metar) {
    var resultado = [3];

    ibkn = metar.indexOf(" BKN00");;
    iovc = metar.indexOf(" OVC00");;
    ivv = metar.indexOf(" VV00");;

    var bkn00 = ibkn > -1;
    var bknbbb = metar.includes(" BKN///");
    var bkn = bkn00 || bknbbb;

    var ovc00 = iovc > -1;
    var ovcbbb = metar.includes(" OVC///");
    var ovc = ovc00 || ovcbbb;

    var vv00 = ivv > -1;
    var vvbbb = metar.includes(" VV///");
    var vv = vv00 || vvbbb;

    resultado[1] = "F";
    resultado[2] = "0";
    resultado[3] = "";



    var inicio = 0;
    var valorTeto = 0;

    if (bkn00) {
        Array(4)
        inicio = metar.indexOf(" BKN00") + 6;
        valorTeto = metar.substr(inicio, 1);
        resultado[2] = valorTeto;
        resultado[3] = "BKN00" + valorTeto;
    }

    if (ovc00) {
        if ((iovc < ibkn) || (ibkn == -1)) {
            inicio = metar.indexOf(" OVC00") + 6;
            valorTeto = metar.substr(inicio, 1);
            resultado[2] = valorTeto;
            resultado[3] = "OVC00" + valorTeto;
        }
    }

    if (vv00) {
        inicio = metar.indexOf(" VV00") + 5;
        valorTeto = metar.substr(inicio, 1);
        resultado[2] = valorTeto;
        resultado[3] = "VV00" + valorTeto;
    }

    if (bknbbb)
        resultado[3] = "BKN///";
    if (ovcbbb)
        resultado[3] = "OVC///";
    if (vvbbb)
        resultado[3] = "VV///";


    if (bkn || ovc || vv) {
        resultado[1] = "T";
    }

    return resultado;
}

function getLocalidade(metar) {
    var campos = [];

    var idxLoc = 1;
    if (metar.indexOf(" COR ") > 0) {
        idxLoc = idxLoc + 1;
    }

    campos = metar.split(" ");

    return campos[idxLoc];
}


function replac(str1, str2, str3) {
    return str1.replace(str2, str3)
}

function getMetar(localidades, Legenda, idxFIR, onLine) {
    var url, url1, url2;

    let interval = getInterval(0)
    if (redemetAntiga) {
        if (intraer)
            url1 = linkIntraer;
        else
            url1 = linkInternet;

        url2 = "&msg=metar";
        //url1 = "https://api-redemet.decea.mil.br/mensagens/metar/"
        //        url1 = "https://redemet.decea.gov.br//api/consulta_automatica/index.php?local=";
        //url2 = `?api_key=${apiKey}`;
    } else {//decea 
        url1 = `${linkAPINova}metar/`;

        url2 = `?api_key=${apiKey}`;
    }
    localidades = localidades.replace(/ /g, ""); //retira os espaços
    url = url1 + localidades + url2 + interval;

    response = "";
    erro = "";

    if (onLine) {
        return GetWebContent(url, idxFIR);
    } else
        trataMetarRedemet(globalStrMetaresOffLine[idxFIR], idxFIR, onLine);
}

function updateArrayStatus(localidade, status) { // retorna true se o status mudou
    /*   var i = globalArrayLocStatus.indexOf(localidade);
       if (i > -1) {
         globalArrayLocStatus
       } 
    */
}

function convertToRedemet(txt, opt = false) {
    str = "";
    txt = txt.split('"mens":"');

    for (i = 0; i < txt.length; i++) {
        s = txt[i];
        if (s.indexOf("METAR") == 0) {
            metar = s.split("=")[0];

            str = str + "0123456789 - " + metar.split("\\").join("") + "=";
        }
        if (s.indexOf("SPECI") == 0) {
            metar = s.split("=")[0];

            str = str + "0123456789 - " + metar.split("\\").join("") + "=";
        }
        if (s.indexOf("GAMET") == 5) {
            metar = s.split("=")[0];

            str = str + "0123456789 - " + metar.split("\\").join("") + "=";
        }
        if (opt && s.indexOf(opt) > -1) {
            metar = s.split("=")[0];

            str = str + "0123456789 - " + metar.split("\\").join("") + "=";
        }
    }

    return str;
}

function limpaMsgErro(erro) {
    if (erro && (erro.indexOf("<title>") > -1))
        return (erro.split("<title>")[1]).split("</title>")[0];
    else
        return (erro);
}

function beepLigado() {
    return ($("#imgSom").attr('src') == "pngs/sound-on30.png")
}

function checkTetoOn() {
    return $("#chkTeto").prop("checked");
}

function checkVentoOn() {
    return $("#chkVento").prop("checked");
}

function checkVisOn() {
    return $("#chkVis").prop("checked");
}

function checkTrovoadaOn() {
    return $("#chkTrovoada").prop("checked");
}

function limpaArrayStatusGamet(idxFIR) {
    if (idxFIR < 0) {
        arrayStatusGamet = []
        return
    }


    arrayStatusGamet.forEach(element => {
        if (element.FIR == idxFIR) {
            element.vis = 9999
            element.teto = 10000
        }

    });
}

function getMensagensAPINova(response) {
    a = JSON.parse(response)
    r = ""
    a.data.data.forEach(a => {
        r = r + "00000000000 - " + a.mens;

    });
    return r
}

function updateRestricaoLoc(loc, restricao) {
    if (!arrRestricaoLoc[loc])
        arrRestricaoLoc[loc] = restricao
    else
        arrRestricaoLoc[loc] = arrRestricaoLoc[loc] + restricao

}

function clearRestricaoLoc(loc) {
    if (arrRestricaoLoc[loc])
        arrRestricaoLoc[loc] = false
}

function removeCacheMessage(txt) {
    if (txt.includes("-->"))
        return txt.split("-->\n")[1]
    else
        return txt
}
function trataMetarRedemet(response, idxFIR, onLine = true) {

    function isMostRecent(arr, loc, i) {
        return (i == (arr.length - 1) || !arr[i + 1].includes(loc))
    }
    //  if (idxFIR ==0)
    //    response = "2021032216 - METAR SBEG 221600Z 03006KT 1500 BR BKN002 31/22 Q1012="

    response = removeCacheMessage(response);
    var erroDeAcesso = response.includes("ErroSM=");
    if (!erroDeAcesso)
        globalStrMetaresOffLine[idxFIR] = response;

    if (response.includes("getaddrinfo failed") || erroDeAcesso) {
        var strErroDeAcesso = limpaMsgErro(response);
        strToCell(["Erro ao tentar obter metares! " + strErroDeAcesso, ""], idxFIR, false, false);
        return;
    }

    limpaMetarFIR(idxFIR);
    if (response.includes("mens")) {
        response = convertToRedemet(response);
    }
    //dataHora = getDataHoraMetares(response);

    arrayMetares = SplitMetares(response);

    c = arraySize(arrayMetares);

    CMA = true;
    CMV = true;

    ventoMaximo = getMaxVnt();
    visMinima = getMinVis();
    cont = 1;
    locAnterior = "";

    var i;
    for (i = 0; i < c; i++) { //a primeira linha está em brancosaveToFile
        metar = arrayMetares[i];
        if (metar.includes("Mensagem ")) {
            metar = "";
        }
        visibilidade = getVisibilidade(metar);
        if (metar !== "") {
            localidade = getLocalidade(metar);
            clearRestricaoLoc(localidade);
            arrayTeto = getTeto(metar);
            tetoBaixo = (arrayTeto[1] == "T") && (checkTetoOn());

            VisibBaixa = (visibilidade >= 0) && (visibilidade < visMinima);
            VisibBaixa = VisibBaixa && checkVisOn();

            //setor = getSetor (metar, fir)

            trovoada = getTrovoada(metar) && checkTrovoadaOn();

            vento = getVento(metar);

            ventoRaj = false;
            ventoAlto = false;
            cortante = getCortante(metar);

            var ventoRajStr = "";
            var ventoStr = "";


            if (parseInt(vento[1]) > ventoMaximo) {
                ventoRajStr = " | RAJADA = " + vento[1] + "KT |";
                ventoRaj = true;
            }
            ventoRaj = ventoRaj && checkVentoOn();

            if (parseInt(vento[0]) > ventoMaximo) {
                ventoStr = " | VNT =" + vento[0] + "KT |";
                ventoAlto = true;
            }
            ventoAlto = ventoAlto && checkVentoOn();


            cortanteStr = ""
            if (cortante) {
                cortanteStr = " | WS |"
            }

            trovoadaStr = ""
            if (trovoada) {
                trovoadaStr = " | TS |"
            }

            var condicaoFiltro = false;

            if (CMA) {
                condicaoFiltro = (ventoAlto || ventoRaj || cortante || trovoada);
            }

            if (CMV) {
                condicaoFiltro = (condicaoFiltro || (VisibBaixa || tetoBaixo));
            }
            var xEscondeSpeciAuto = false;
            if (locAnterior == localidade) { //se o speci for da mesma localidade então mostra 
                $('.tr' + localidade).removeClass('errorPulse') //retira o erro da mensagem anterior
                condicaoFiltro = true;
                if (metar.indexOf(" AUTO ") > -1)
                    xEscondeSpeciAuto = escondeSpeciAUTO
            }
            var novo = false;
            if (condicaoFiltro) {
                var indNovo01 = metaresFiltrados.indexOf("1" + metar); //malabarismo pra mostrar por 2 minutos ;
                var indNovo02 = metaresFiltrados.indexOf("2" + metar);
                novo = (indNovo01 == -1 && indNovo02 == -1);
                achou = !novo;
                if (achou) {
                    if (indNovo01 > -1) { // achou o 1  segunda passagem, transforma em 2
                        metaresFiltrados[indNovo01] = metaresFiltrados[indNovo01].replace("1" + metar, "2" + metar);
                    }
                } else {
                    if (primeiraVez) // se acabou de abrir o site
                        metaresFiltrados.push("2" + metar);
                    else {
                        metaresFiltrados.push("1" + metar);
                    }
                }
                novo = ((indNovo01 > -1) || novo);

                locAnterior = localidade; //apenas se mostrar ele 
                //strToCell (metar, 0, idxFIR);

                //strToCell (setor, 4, linIni + cont);

                tetoStr = "";
                if (tetoBaixo) {
                    tetoStr = " | TETO = " + arrayTeto[2] + "00FT |";
                    metar = spanRed(metar, " " + arrayTeto[3] + " ");
                    updateRestricaoLoc(localidade, "*TETO");
                }

                var visStr = "";
                if (VisibBaixa) {
                    visStr = " | VIS = " + parseInt(visibilidade) + "M |";
                    metar = spanRed(metar, " " + visibilidade + " ");
                    updateRestricaoLoc(localidade, "*VISIBILIDADE");
                }

                if (cortante) {
                    metar = spanRed(metar, " WS ");
                    updateRestricaoLoc(localidade, "*WS");
                }

                if (trovoada) {
                    metar = spanRed(metar, " TS ");
                    metar = spanRed(metar, " TSRA ");
                    metar = spanRed(metar, " TSGR ");
                    metar = spanRed(metar, " TSGRRA ");
                    metar = spanRed(metar, " TSRAGR ");

                    metar = spanRed(metar, " +TSRA ");
                    metar = spanRed(metar, " +TSGR ");
                    metar = spanRed(metar, " +TSGRRA ");
                    metar = spanRed(metar, " +TSRAGR ");

                    metar = spanRed(metar, " -TSRA ");
                    metar = spanRed(metar, " -TSGR ");
                    metar = spanRed(metar, " -TSGRRA ");
                    metar = spanRed(metar, " -TSRAGR ");
                    updateRestricaoLoc(localidade, "*TROVOADA");
                }
                if (ventoAlto) {
                    metar = spanRed(metar, vento[2]);
                    updateRestricaoLoc(localidade, "*VENTO");
                }

                if (ventoRaj) {
                    metar = spanRed(metar, "G" + vento[1] + "KT");
                    metar = metar.replace(' <span style="color:red">G' + vento[1] + "KT", '<span style="color:red">G' + vento[1] + "KT");
                    updateRestricaoLoc(localidade, "*RAJADA");
                }

                // return metar.includes(" TS ") || metar.includes("TSRA ") || metar.includes("TSGR ");
                var strStatusMetar = visStr + tetoStr + ventoStr + ventoRajStr + cortanteStr + trovoadaStr;
                //updateArrayStatus (strStatusMetar);
                strToCell([metar, strStatusMetar, { vento: vento, teto: arrayTeto[2], tetoBaixo: tetoBaixo, visibilidade: parseInt(visibilidade), maisRecente: isMostRecent(arrayMetares, localidade, i) }], idxFIR, novo, xEscondeSpeciAuto);

                cont = cont + 1;
            }
        }
    }
    if (cont == 1) {
        strToCell(["NENHUMA LOCALIDADE COM RESTRIÇÃO", ""], idxFIR, false, false, onLine);
        cont = cont + 1;
    }
    limpaArrayStatusGamet(idxFIR)

    trataGametRedemet(lastGamet)
    exportaMetares(idxFIR);
    return cont; //retorna o total de metares lidos +1
}

function spanColor(txt, palavra, title = "", color, bold) {
    if (title !== "")
        title = ' title="' + title + '"'
    bi = bf = ""
    if (bold) {
        bi = "<b>"
        bf = "</b>"
    }

    return txt.replace(palavra, ' ' + bi + '<span style="color:' + color + '"' + title + '>' + palavra + "</span>" + bf + " ")
    //return txt.replace(palavra, ' <font color="' + color + '"' + tit + '>' + palavra + "</font> ")

}

function spanRed(txt, palavra, title) {
    return spanColor(txt, palavra, title, "red")

}

function spanRedBold(txt, palavra, title) {
    return `${spanColor(txt, palavra, title, "red", true)}`

}

function spanGray(txt, palavra, title) {
    return spanColor(txt, palavra, title, "gray")

}

function updateChks(source) {
    if (!smartPlotOnline)
        return;
    if (source == "SP") {
        //smartplot
        $('#chkTeto').prop('checked', smartPlot.$('#chkTeto').prop('checked'))
        $('#chkVento').prop('checked', smartPlot.$('#chkVento').prop('checked'))
        $('#chkTrovoada').prop('checked', smartPlot.$('#chkTrovoada').prop('checked'))
        $('#chkVis').prop('checked', smartPlot.$('#chkVisibilidade').prop('checked'))
    } else //if (source == "SM") 
    {
        smartPlot.$('#chkTeto').prop('checked', $('#chkTeto').prop('checked'))
        smartPlot.$('#chkVento').prop('checked', $('#chkVento').prop('checked'))
        smartPlot.$('#chkTrovoada').prop('checked', $('#chkTrovoada').prop('checked'))
        smartPlot.$('#chkVisibilidade').prop('checked', $('#chkVis').prop('checked'))
    }

}

function BtnMetarGERALClick(onLine, source = "") {
    var contAZ, contAZBS, contAZBSRE;

    updateChks(source);
    //limpaMetares(); //agora só limpa depois da resposta.
    arrMetaresFiltrados.length = 0
    TipoConsulta = "GERALCMA";

    getMetarFromFIR(0, "FIR AMAZÔNICA", onLine);
    getMetarFromFIR(1, "FIR BRASÍLIA", onLine);
    getMetarFromFIR(2, "FIR RECIFE", onLine);
    getMetarFromFIR(3, "FIR CURITIBA", onLine);
    //	metaresFiltrados = []; //limpa as marcações para a proxima consulta

    //VerificaTimer();
}

function alternaImagemSom() {
    if ($("#imgSom").attr('src') == "pngs/sound-on30.png") {
        $.cookie("som", "off", { expires: 30 });
        $("#imgSom").attr('src', "pngs/sound-off30.png");
    }
    else {
        $("#imgSom").attr('src', "pngs/sound-on30.png");
        $.cookie("som", "on", { expires: 30 });
    }
}

function atualizaHora(Texto) {
    $("#relogio").text(Texto);
}

function fillZero(n) {
    return (n < 10 ? "0" + n : n)
}

function isMobile() {
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    return isMobile.any();
}

function getMetarFromFIR(firIdx, Legenda, onLine) {

    var txtLoc;
    txtLoc = localidadesFIR[firIdx];

    var agora = new Date();
    TempoCorrido = 0;

    var h = fillZero(agora.getHours());
    var m = fillZero(agora.getMinutes());
    var s = fillZero(agora.getSeconds());

    if (onLine) {
        atualizaHora("Hora da Última Consulta à REDEMET: " + h + ":" + m + ":" + s);
    }
    return getMetar(txtLoc, Legenda, firIdx, onLine);

}


function limpaMetares() {
    for (var i = 0; i < 4; i++) {
        $('#' + arrayTableFir[i] + ' > tbody').html("");
    }
}

function limpaMetarFIR(fir) {
    $('#' + arrayTableFir[fir] + ' > tbody').html("");
}

function getCMA(loc) {
    var arrayIniciais = "SB,SD,SI,SJ,SN,SS,SW"
    var ini = loc.substr(0, 2)
    if (arrayIniciais.indexOf(ini) == -1)
        return "ESTRANGEIRA"

    for (var i in arrayCMA) {
        if (arrayCMA[i].indexOf(loc) > -1)
            return arrayCMA[i].substr(0, 4)
    }
    return ""
}

function getAirmet(loc) {
    if (smartPlot.closed)
        return { texto: "", vis: "", teto: "", achou: false, offline: true }

    let airmets = smartPlot.arrAirmetGeral;
    let result = ""
    let sep = "&#10;&#10;"
    let vis = 9999
    let teto = 1500
    let achou = false
    for (let i in airmets) {
        if ((!airmets[i].cancelado) && airmets[i].locs.includes(loc)) {
            if ((airmets[i].visibilidade >= 0) && (parseInt(airmets[i].visibilidade) < parseInt(vis)))
                vis = airmets[i].visibilidade
            if ((airmets[i].base >= 0) && (parseInt(airmets[i].base) < parseInt(teto)))
                teto = airmets[i].base
            result = result + sep + smartPlot.getAirmetDescription(airmets[i], true)
            achou = true
        }


    }
    if (!achou) {
        vis = ""
        teto = ""
    }

    return { texto: result, vis: vis, teto: teto, achou: achou, offline: false }
}

function getStatusSigmet(loc) {
    for (let i in arrayStatusGamet) {
        if (arrayStatusGamet[i].loc == loc) {
            return ({ loc: loc, teto: arrayStatusGamet[i].teto, vis: arrayStatusGamet[i].vis })
        }
    }
    return ({ loc: false, teto: 1500, vis: 9999 })
}

function getStatusAirmet(loc) {
    let txtAirmet = "";
    let visAirmet = "";
    let tetoAirmet = "";
    let statusAirmet = "";
    let achouAirmet = false
    try {
        let airmet = getAirmet(loc)
        txtAirmet = airmet.texto;
        visAirmet = airmet.vis;
        tetoAirmet = airmet.teto;
        achouAirmet = airmet.achou;

        if (achouAirmet) {
            visAirmet = visAirmet + "M"
            if ((visAirmet !== "9999M"))
                visAirmet = spanRedBold(visAirmet, visAirmet)
            tetoAirmet = tetoAirmet + "FT";
            if (tetoAirmet !== "1500FT")
                tetoAirmet = spanRedBold(tetoAirmet, tetoAirmet)
            statusAirmet = visAirmet + " / " + tetoAirmet
            return { texto: txtAirmet, vis: visAirmet, teto: tetoAirmet, tetoNum: airmet.teto, status: statusAirmet, achou: true, offline: airmet.offline }
        }
    } catch (e) {
        console.log("Erro ao Obter os Airmets")
    }
    if (!achouAirmet)
        return { texto: "", vis: "", teto: "", status: "", achou: false }
    //  return { achou: false }
}

function verificaStatusMetar(statusMetar, statusAdWRNG, statusAirmet, statusSigmet) {
    function isBigger(dado1, dado2) {
        dado1 = parseInt(dado1)
        dado2 = parseInt(dado2)
        if (isNaN(dado2))
            dado2 = -1

        if (dado1 <= 0)
            return false

        if (dado2 > 0 && dado1 > dado2) {
            return true
        } else if (dado2 <= 0)
            return true
        return false
    }

    function isLower(dado1, dado2, tipo, semFiltro = false) {

        function ajustaParametroTaf(dado, tipo) {
            let arrayVis = [150, 350, 600, 800, 1500, 3000, 5000]//m
            let arrayTeto = [100, 200, 500, 1000, 1500]//ft
            let array
            if (tipo == "T")
                array = arrayTeto.slice()
            else
                array = arrayVis.slice()

            let i = 0
            while ((dado >= array[i]) && (i < array.length)) {
                i++
            }
            if (i == 0)
                return 0
            else
                return array[i - 1]
        }

        dado1 = parseInt(dado1)
        dado2 = parseInt(dado2)

        if (isNaN(dado2))
            dado2 = -1

        if (dado1 < 0)
            return { restricao: false, alerta: false }

        if (dado2 > 0 && dado1 < dado2) {
            if (!semFiltro) {
                dado1 = ajustaParametroTaf(dado1, tipo)
                dado2 = ajustaParametroTaf(dado2, tipo)
            }
            if (dado1 < dado2)
                return { restricao: true, alerta: false }
            else
                return { restricao: false, alerta: true }
        }
        else if (dado2 < 0)
            return { restricao: true, alerta: false }

        return { restricao: false, alerta: false }
    }

    let tetoMetar = parseInt(statusMetar.teto) * 100;
    let visMetar = parseInt(statusMetar.visibilidade);
    let arrayRest = []
    let arrayAlerta = []

    //Check Teto
    if (statusMetar.tetoBaixo) {
        let tetoCobertoA = true
        let tetoCobertoS = true
        let checkTetoAirmet = isLower(tetoMetar, statusAirmet.tetoNum, "T")
        let checkTetoAirmetSemFiltro = isLower(tetoMetar, statusAirmet.tetoNum, "T", true)
        if (checkTetoAirmet.restricao) {
            tetoCobertoA = false
        }

        let checkTetoSigmet = isLower(tetoMetar, statusSigmet.teto, "T")
        let checkTetoSigmetSemFiltro = isLower(tetoMetar, statusSigmet.teto, "T", true)
        if (checkTetoSigmet.restricao) {
            tetoCobertoS = false
        }

        if (checkTetoSigmet.alerta || checkTetoAirmet.alerta)
            if (checkTetoSigmetSemFiltro.restricao && checkTetoAirmetSemFiltro.restricao) //apenas se o teto estiver menor do que nas duas previsoes
                arrayAlerta.push("Teto")

        if (!tetoCobertoA && !tetoCobertoS) //return apenas se descoberto
            arrayRest.push("Teto")
    }

    //Check Visib
    if (visMetar >= 0 && visMetar < 5000) {
        let visCobertaA = true
        let visCobertaS = true

        let checkVisAirmet = isLower(visMetar, getNum(statusAirmet.vis), "V")
        let checkVisAirmetSemFiltro = isLower(visMetar, getNum(statusAirmet.vis), "V", true)
        if (checkVisAirmet.restricao) {
            visCobertaA = false
        }

        let checkVisSigmet = isLower(visMetar, statusSigmet.vis, "V")
        let checkVisSigmetSemFiltro = isLower(visMetar, statusSigmet.vis, "V", true)
        if (checkVisSigmet.restricao) {
            visCobertaS = false
        }
        if (!visCobertaA && !visCobertaS) //return apenas se descoberto
            arrayRest.push("Visibilidade")

        if (checkVisSigmet.alerta || checkVisAirmet.alerta)
            if (checkVisSigmetSemFiltro.restricao && checkVisAirmetSemFiltro.restricao) //apenas se a vis estiver menor do que nas duas previsoes
                arrayAlerta.push("Visibilidade")
    }

    //if (parseInt(statusMetar.vento[1]) > globalVentoMax) {
    if (parseInt(statusMetar.vento[1]) > 21) {
        if (isBigger(statusMetar.vento[1], statusAdWRNG.max * (1 + (toleranciaRajada/100))))
            arrayRest.push("Rajada")
    }

    //  if (parseInt(statusMetar.vento[0]) > globalVentoMax) {
    if (parseInt(statusMetar.vento[0]) > 21) {
        if (isBigger(statusMetar.vento[0], statusAdWRNG.max))
            arrayRest.push("Vento");
    }

    return { coberto: (arrayRest.length == 0), tipo: arrayRest, alerta: arrayAlerta.length > 0, tipoAlerta: arrayAlerta }
}

function strToCell(arr, idxFIR, novo, naoAdiciona, onLine = true) {//nãoadiciona significa substituir(apagar o anterior)
    var table;
    var classe = 'class = "table-striped comum';
    if (primeiraVez)
        novo = false;
    //  if (arr[0].includes("Erro") || novo)
    if (arr[0].includes("Erro"))
        classe = 'class = "table-danger comum"';

    var loc = getLocalidade(arr[0]);
    tit = getDescricao(loc);
    var lat = getLatStr(loc)
    var long = getLngStr(loc);

    var cma = "";
    var id = "";
    if (loc.length !== 4)
        latLong = ""
    else {
        arrMetaresFiltrados.push({ FIR: idxFIR, localidade: loc, latitude: getLat(loc), longitude: getLng(loc) });
        latLong = '&#10;Lat: ' + lat + '&#10;Long: ' + long;
        cma = getCMA(loc);

        classe = classe.replace("comum", "tr" + loc)

        // if (cma == "ESTRANGEIRA") 
    }

    try {
        if (arr && arr[2] && !arr[2].maisRecente || (cma == "ESTRANGEIRA"))
            classe += " linhaInativa"
    } catch (e) {
        console.log("Erro ao tentar verificar se o Metar é o Mais Recente!");
    }

    if (!tit || (tit == 'undefined') || (tit.length == 0)) {
        tit = "";
        latLong = "";
        //cma = "";
    }

    let regAirmet = getStatusAirmet(loc);
    let classStatusAirmet = ""
    let classeAdWRNG = ""
    if (!smartPlot || smartPlot.closed) {
        //if (smartPlot)
        //smartplot.close();
        regAirmet.status = "SMARTPLOT OFFLINE"
        classStatusAirmet = " class='errorPulse' style='color: red; font-weight: bold;'"
        smartPlotOnline = false
    } else
        smartPlotOnline = true
    let regSigmet = getStatusSigmet(loc);
    let statusSigmet = ""
    let statusAdWRNG = getStatusAdWRNG(loc)
    let txtAdWRNG = ""
    let txtTitleAdWRNG = ""
    let descRestricao = ""
    let descAlerta = ""
    let infoAlerta = ""
    let adWRNGVencendo = adWRNGPertoDoFim(statusAdWRNG.textoFull);
    
    let titleDegrada = "São utilizados nos AIRMETS, por analogia, os parâmetros para confecção de emendas TAF (segundo o item 8.2.9, da ICA 105-17/2020), para TETO E VISIBILIDADE:&#10;&#10;&#10;Parâmetros de visibilidade = 150M, 350M, 600M, 800M, 1500M, 3000M, 5000M &#10;&#10;Parâmetros de teto = 100FT, 200FT, 500FT, 1000FT, 1500FT"
    let xInfoAlerta = '<img src="pngs/info-26.png" title="' + titleDegrada + '" style="cursor: pointer;">'

    if ((statusAdWRNG.texto !== "") && (!statusAdWRNG.cancelado)) {
        txtAdWRNG = statusAdWRNG.texto

        let arrADTmp = ["TC ", "TS ", "GR ", "SN ", "FZRA ", "FZDZ ", "RIME ", "SS ", "DS ", "SA ", "DU ", "SQ ", "FROST ", "VA ", "TSUNAMI ", "TOX CHEM "]
        arrADTmp.forEach(t => {
            txtAdWRNG = spanRedBold(txtAdWRNG, t)
        });

        txtAdWRNG = spanRedBold(txtAdWRNG, `${statusAdWRNG.min}KT MAX ${statusAdWRNG.max}`);
        txtTitleAdWRNG = '&#10;' + 'AVISO DE AERÓDROMO' + '&#10;&#10;' + statusAdWRNG.textoFull
    } else
        statusAdWRNG = ""
    //  if (regSigmet.loc) {
    if (loc && (loc.length == 4) && (cma.length <= 4)) {
        let vis = regSigmet.vis + "M"
        let teto = regSigmet.teto + "FT"

        if (vis !== "9999M")
            vis = spanRedBold(vis, vis)
        if (teto !== "10000FT")
            teto = spanRedBold(teto, teto)
        statusSigmet = vis + " / " + teto
        let arrStatusMetar = verificaStatusMetar(arr[2], statusAdWRNG, regAirmet, regSigmet)
        if (!arrStatusMetar.coberto && arr[2].maisRecente) { //Localidade descoberta
            classe = classe + " table-danger"
            descRestricao = '<br>' + 'Parâmetros descobertos: '
            let sep = ''
            arrStatusMetar.tipo.forEach(i => {
                descRestricao += sep + i
                sep = ', '
            })
            if (novo && firVisible[idxFIR] && beepLigado() && onLine) //falta olhar o casa da mensagem nao ser nova
                $("#divDoubleBeep").click();

            descRestricao = '<b>' + spanRed(descRestricao, descRestricao) + '<b>'
        }
        if (arrStatusMetar.alerta && arr[2].maisRecente) {
            descAlerta = '<br>' + 'Parâmetros em degradação: '
            let sep = ''
            arrStatusMetar.tipoAlerta.forEach(i => {
                descAlerta += sep + i
                sep = ', '
            })

            descAlerta = '<b>' + spanRed(descAlerta, descAlerta, titleDegrada) + '<b>'

        }
        if ((descAlerta + descRestricao).length > 0)
            infoAlerta = xInfoAlerta
        
        if (adWRNGVencendo && arr[2].maisRecente)
            classeAdWRNG += " pulseValid"
            

    }
    classe = classe + '"'

    if (naoAdiciona)
        $('#' + arrayTableFir[idxFIR] + ' tr:last').remove();

    let line = '<tr title="' + tit.toUpperCase() + latLong + '&#10;&#10;CMA-1: ' + cma + '&#10;&#10;' + regAirmet.texto + txtTitleAdWRNG + '" ' + classe + id + '><td><b>' + arr[0] + '</b>' + descRestricao + descAlerta + infoAlerta + `</td><td class = "${classeAdWRNG}">` + txtAdWRNG + '</td><td>' + statusSigmet + '</td><td ' + classStatusAirmet + '>' + regAirmet.status + '</td><td>' + cma + '</td></tr>'
    var row = $('#' + arrayTableFir[idxFIR] + ' tbody').append(line);
    $('.tr' + loc).click(function () {
        var loc = $(this).closest('tr').prop('class').split(" ")[1];
        loc = loc.replace("tr", "")
        if (smartPlot.plotarAreaLocalidade !== undefined)
            smartPlot.plotarAreaLocalidade(loc, true);
    });
    return;
}

function insertRowGamet(tableStr, str, idx) {

    if (!idx)
        $(table).append(str);
    else {
        var table = document.getElementById(tableStr).getElementsByTagName('thead')[0];

        // Create an empty <tr> element and add it to the 1st position of the table:
        var row = table.insertRow(idx);
        var cell1 = row.insertCell(0);
        //var cell2 = row.insertCell(1);
        cell1.innerHTML = str;
        //cell2.innerHTML = "NEW CELL2";
    }
}

function SplitMetares(strMetar) {
    function getDataHora(str) {
        var patt2 = /\d{10} - /g;
        var t1 = str.match(patt2)
        if (t1 && t1.length > 0)
            return t1[0]
        else
            return str

    }
    var t = strMetar.replace(/  /g, " ")

    t = t.split('=')

    if (t.length < 1)
        return strMetar


    for (var i in t) {
        var dataHora = getDataHora(t[i])
        //console.log(dataHora)
        t[i] = t[i].split(dataHora)[1] + "="
    }
    return t.splice(0, t.length - 1);
}

function arraySize(array) {
    return array.length;
}

function getDataHoraMetares(strMetares) {
    if ((strMetares) && (strMetares.length > 13))
        return strMetares.substr(0, 13); //'tb pega o hifen e os espaços
    else
        return "";
}

function getVento(metar) {
    var campos = [];
    var ventoeRajada = [3];
    ventoeRajada[0] = "-1";
    ventoeRajada[1] = "-1";
    ventoeRajada[2] = "";


    posVento = getposVis(metar) - 1;

    campos = metar.split(" ");

    vento = campos[posVento];
    let inicioVel = 3
    if (vento.includes('P99'))
        inicioVel = 4

    ventoeRajada[2] = vento;

    //00099G00KT
    if (vento.includes("G")) {
        let inicioVelRaj = inicioVel + 3;
        if (vento.includes("GP"))
            inicioVelRaj += 1;
        ventoeRajada[1] = vento.substr(inicioVelRaj, 2); //'6 ate o final
        ventoeRajada[0] = vento.substr(inicioVel, 2);
    }
    else {
        ventoeRajada[1] = "-1";  //'6 ate o final
        ventoeRajada[0] = vento.substr(inicioVel, 2);
    }

    return ventoeRajada;
}

function getposVis(metar) {
    var posVis = 4;

    if (metar.includes(" COR ")) {
        posVis = posVis + 1;
    }

    if (metar.includes(" AUTO ")) {
        posVis = posVis + 1;
    }

    return posVis;
}

function getVisibilidade(metar) {

    var campos = [];
    var posVis;

    if (metar.includes(" CAVOK ") || metar.includes(" 9999 ")) {
        return 10000
    }

    posVis = getposVis(metar);

    campos = metar.split(" ");

    if (posVis < arraySize(campos)) {
        visib = campos[posVis] + "";
    }
    else {
        return -1;
    }

    if (visib.length > 4) {
        if (visib.indexOf("V") > -1) { //vento variando
            posVis = posVis + 1;
            visib = campos[posVis];
            return visib;
        }
        else {
            return -1
        }
    }
    else {
        return visib
    }

}

function atualizaSelectVis() {
    var $option = $("#selectVis").find('option:selected');
    //Added with the EDIT
    globalVisMax = parseInt($option.val());//to get content of "value" attrib
}

function atualizaSelectVento() {
    var $option = $("#selectVento").find('option:selected');
    //Added with the EDIT
    globalVentoMax = parseInt($option.val());//to get content of "value" attrib
}

function selectVisChange() {
    atualizaSelectVis();
    BtnMetarGERALClick(false);
}

function selectVentoChange() {
    atualizaSelectVento();
    BtnMetarGERALClick(false);
}


function getMinVis() {
    return globalVisMax;
    //conceptName = $('#aioConceptName').find(":selected").text();
}

function getMaxVnt() {
    return globalVentoMax;
}
