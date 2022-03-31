var aeroIntern = "SBBG* SBBE SBCF SBBV SBBR SBKP SBCG SBCR SBCZ SBCY SBCT SBFL SBFZ SBFI SBJP SBMQ SBEG SBNF SBPK SBPP SBPA SBPV SBRF SBRP* SBRB* SBGL SBSV SBSN SBSG SBSJ SBSP* SBVT* SBSL SBGR SBTT SBPB SBPL* SBPS* SBCB*	SBMO* SBMG*"
var groupMarkers = false
var groupMarkersHide = false
var arrayMetaresGeral = []
var strRiscoBaixo = "Risco Baixo (Verde)"
var strRiscoModerado = "Risco Moderado (Amarelo)"
var strRiscoAlto = "Risco Alto (Vermelho)"
var strRiscoMuitoAlto = "Risco Muito Alto (Preto)"

var sombra1 = "text-shadow: 0px 0px 1px black;"
var sombra2 = "text-shadow: 0px 0px 2px black;"
var sombra3 = "text-shadow: 0px 0px 3px black;"
var iconSize = 18

/*function spanColor(texto, cor) {
    return `<span style="color:${cor}"> ${texto} + </span>`
}*/

function insertSpanClass(str, classe) {
    return str.replace(/style="/g, `style="${classe}`);
}

function spanBold(texto) {
    return `<b>${texto}</b>`
}

function getMetaresGeral() {
    for (let i = 0; i < 4; i++) {
        getMetar(localidadesFIR[i], "", i, true)
    }
}

function start() {
    plotaAeroportos();
    getMetaresGeral();
    setInterval(getMetaresGeral, 60000)

}

function removeEspacos(str) {
    return str.replace(/ /g, "")
}

function getTipoAlerta(loc) {
    return false
}

function bringRedMarkersToFront(layers) {
    //layer1.bringToFront();   
    layers.eachLayer(function (layer) {
        if (layer.options.icon.options.alt >= 1000)
            layer.setZIndexOffset(5000);
    });
}

function addMarker(m, loc, restricao, pulse = false) {
    // if (pulse)
    //     return m.addTo(map)

    let int = aeroIntern.indexOf(loc) > -1

    if (!int && !restricao) {
        if (!groupMarkersHide)
            groupMarkersHide = new L.FeatureGroup();
        groupMarkersHide.addLayer(m)
    } else {
        if (!groupMarkers)
            groupMarkers = new L.FeatureGroup();
        groupMarkers.addLayer(m)
    }


    //return m.addTo(map)
    return m
}


function makeMap() {
    //  Init Overlays
    var overlays = {};
    //
    //Init BaseMaps
    var basemaps = {
        "OpenStreetMaps": L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                minZoom: 2,
                maxZoom: 19,
                id: "osm.streets"
            }
        ),
        "Google-Map": L.tileLayer(
            "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
            {
                minZoom: 2,
                maxZoom: 19,
                id: "google.street"
            }
        ),
        "Google-Satellite": L.tileLayer(
            "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            {
                minZoom: 2,
                maxZoom: 19,
                id: "google.satellite"
            }
        ),
        "Google-Hybrid": L.tileLayer(
            "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
            {
                minZoom: 2,
                maxZoom: 19,
                id: "google.hybrid"
            }
        )
    };

    //Map Options
    var mapOptions = {
        zoomControl: false,
        attributionControl: false,
        center: [-21.0529434318608, -48.01910972595218],
        zoom: 5,
        layers: [basemaps.OpenStreetMaps]
    };

    //Render Main Map

    map = L.map("map", mapOptions);

}

function loadMap() {
    /*    var map = L.map('map', {
            center: [-15.505, -53.09],
            zoom: 4
        });
        
        var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
        osm.addTo(map);
        */
    makeMap();

};

$(document).ready(function () {
    document.getElementById('btnMainPopUp').click();
    loadMap();
    getAeroportos();
});

function exportaMetares(arrayMetares) {
    for (let i in arrayMetares) {
        let metar = arrayMetares[i]
        let loc = getLocalidade(metar)
        updateArrayMetaresGeral(loc, metar)
    }
    plotaAeroportos();
}

function plotaAeroportos() {
    if (groupMarkersHide) {
        map.removeLayer(groupMarkersHide); // corrige o problema de não apagar os markers com o zoom out no inicio
        groupMarkersHide = false
    }
    if (groupMarkers) {
        map.removeLayer(groupMarkers); // corrige o problema de não apagar os markers com o zoom out no inicio
        groupMarkers = false
    }
    //updateDescobertos(false)
    for (var i in localidadesFIR) {
        var fir = removeEspacos(localidadesFIR[i])
        var aloc = fir.split(",")
        for (var j in aloc) {
            var loc = aloc[j]
            var long = getLatL(loc)
            var lat = getLngL(loc)
            plotaMarca(long, lat, loc)
            //var busca = checaPontoA([long,lat])
            //console.log("busca >",loc + " / "+busca)
        }
    }

    if (map.getZoom() > 5 && groupMarkersHide)
        map.addLayer(groupMarkersHide); // corrige o problema de não apagar os markers com o zoom out no inicio

    if (groupMarkers) {
        map.addLayer(groupMarkers); // corrige o problema de não apagar os markers com o zoom out no inicio
        bringRedMarkersToFront(groupMarkers)
    }

}

function updateArrayMetaresGeral(loc, met) {
    let achou = false
    let i = 0
    arrayMetaresGeral.forEach(itemG => {
        if (itemG.includes(loc)) {
            achou = true
            arrayMetaresGeral[i] = met

            return true
        }
        i++

    })
    if (!achou)
        arrayMetaresGeral.push(met)
    return false
}

function getMetarFromLoc(loc) {
    function buscaMetar(array, loc) {
        let xitem = loc

        for (i in array) {
            if (array[i].includes(loc)) {
                xitem = array[i];
                break;
            }
        }
        return xitem
    }

    let met = buscaMetar(arrayMetaresGeral, loc) //busca os que tem restrição
    return met
}

function plotaMarca(lat, lng, loc) {
    function getSvgIcon(loc, strAlerta) {
        //inicio x = 78
        let inicioX = 78;
        let offSetX = 0;
        let alt = 0
        let color = "yellow"
        let boxOpacity = "0.8";
        let backGroundColor = "#444";
        let classSvgIcon

        //if (adWRNGPertoDoFim)

        let iconColor = color

        if (strAlerta.includes("***")) {
            svgTeto = `<g transform="matrix(0.35 0 0 0.35 ${inicioX}.02 67.61)"  >
        <g style=""   >
                <g transform="matrix(1 0 0 1 43.46 21.75)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-231.57, -209.86)" d="M 338.103 201.978 c 1.733 -6.085 2.61 -12.372 2.61 -18.756 c 0 -37.746 -30.708 -68.455 -68.454 -68.455 c -15.702 0 -31.042 5.453 -43.193 15.354 c -10.807 8.805 -18.705 20.773 -22.558 34.057 c -25.26 -2.36 -48.097 13.667 -55.234 37.059 c -3.824 -0.87 -7.731 -1.309 -11.671 -1.309 c -29.051 0 -52.686 23.464 -52.686 52.514 c 0 29.051 23.635 52.515 52.686 52.515 h 183.931 c 29.051 0 52.685 -23.464 52.685 -52.515 C 376.22 228.676 360.49 208.367 338.103 201.978 z" stroke-linecap="round" />
        </g>
                <g transform="matrix(1 0 0 1 -90.95 -34)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-97.16, -154.11)" d="M 130.402 177.248 l 2.936 0.016 l 1.444 -2.556 c 10.411 -18.427 29.165 -30.778 50.168 -33.04 l 2.788 -0.3 l 1.197 -2.535 c 0.995 -2.106 2.117 -4.23 3.334 -6.313 l 2.045 -3.498 l -2.998 -2.725 c -8.986 -8.17 -20.753 -12.669 -33.131 -12.669 c -1.311 0 -2.637 0.054 -3.968 0.162 c -7.85 -24.892 -32.261 -42.525 -59.755 -42.525 c -34.414 0 -62.412 26.82 -62.412 59.787 c 0 5.289 0.718 10.5 2.141 15.555 C 14.072 152.409 0 170.187 0 190.789 c 0 25.457 21.612 46.167 48.178 46.167 h 16.221 l 0.648 -4.244 c 4.906 -32.088 32.06 -55.398 64.612 -55.512 C 129.907 177.229 130.155 177.247 130.402 177.248 z" stroke-linecap="round" />
        </g>
        </g>
        </g>`;
            offSetX += 150;
            contRestricoes += 1
        }

        if (strAlerta.includes("***")) {
            //inicio x= 84

            inicioX = 84 + offSetX;

            svgVisibilidade = `<g transform="matrix(0.67 0 0 0.67 ${inicioX}.6 68.6)"  >
        <g style=""   >
        <g transform="matrix(1 0 0 1 -36.32 -61.62)" id="Capa_1"  >
        
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-72.4, -47.09)" d="M 144.797 47.095 c 0 -4.142 -3.358 -7.5 -7.5 -7.5 H 7.5 c -4.142 0 -7.5 3.358 -7.5 7.5 c 0 4.142 3.358 7.5 7.5 7.5 h 129.797 C 141.439 54.595 144.797 51.237 144.797 47.095 z" stroke-linecap="round" />
        </g>
                <g transform="matrix(1 0 0 1 25.57 -30.81)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-134.28, -77.91)" d="M 209.93 70.405 H 58.632 c -4.142 0 -7.5 3.358 -7.5 7.5 s 3.358 7.5 7.5 7.5 H 209.93 c 4.142 0 7.5 -3.358 7.5 -7.5 S 214.072 70.405 209.93 70.405 z" stroke-linecap="round" />
        </g>
                <g transform="matrix(1 0 0 1 -10.23 0)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-98.49, -108.71)" d="M 174.53 116.214 c 4.142 0 7.5 -3.358 7.5 -7.5 c 0 -4.142 -3.358 -7.5 -7.5 -7.5 H 22.446 c -4.142 0 -7.5 3.358 -7.5 7.5 c 0 4.142 3.358 7.5 7.5 7.5 H 174.53 z" stroke-linecap="round" />
        </g>
        
                <g transform="matrix(1 0 0 1 14.81 30.81)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-123.53, -139.52)" d="M 199.441 132.024 H 47.619 c -4.142 0 -7.5 3.358 -7.5 7.5 s 3.358 7.5 7.5 7.5 h 151.822 c 4.142 0 7.5 -3.358 7.5 -7.5 S 203.583 132.024 199.441 132.024 z" stroke-linecap="round" />
        </g>
                <g transform="matrix(1 0 0 1 -33.3 61.62)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-75.41, -170.34)" d="M 125.759 162.835 H 25.068 c -4.142 0 -7.5 3.358 -7.5 7.5 c 0 4.142 3.358 7.5 7.5 7.5 h 100.69 c 4.142 0 7.5 -3.358 7.5 -7.5 C 133.259 166.193 129.901 162.835 125.759 162.835 z" stroke-linecap="round" />
        </g>
        </g>
        </g>`
            offSetX += 150;
            contRestricoes += 1

        }

        if (strAlerta.includes("***")) {

            //inicio x =83    
            inicioX = 83 + offSetX;

            svgVento = `<g transform="matrix(8.81 0 0 8.81 ${inicioX}.23 70.15)"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-8, -8)" d="M 12.5 2 A 2.5 2.5 0 0 0 10 4.5 a 0.5 0.5 0 0 1 -1 0 A 3.5 3.5 0 1 1 12.5 8 H 0.5 a 0.5 0.5 0 0 1 0 -1 h 12 a 2.5 2.5 0 0 0 0 -5 z m -7 1 a 1 1 0 0 0 -1 1 a 0.5 0.5 0 0 1 -1 0 a 2 2 0 1 1 2 2 h -5 a 0.5 0.5 0 0 1 0 -1 h 5 a 1 1 0 0 0 0 -2 z M 0 9.5 A 0.5 0.5 0 0 1 0.5 9 h 10.042 a 3 3 0 1 1 -3 3 a 0.5 0.5 0 0 1 1 0 a 2 2 0 1 0 2 -2 H 0.5 a 0.5 0.5 0 0 1 -0.5 -0.5 z" stroke-linecap="round" />
        </g>`;
            offSetX += 150;

            contRestricoes += 1
        }

        if (strAlerta.includes("TROVOADA")) {
            inicioX = 68 + offSetX;

            //inicio x=60
            svgTrovoada = `<g transform="matrix(0.27 0 0 0.24 ${inicioX}.3 71.1)" id="Capa_1"  >
        <path style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${iconColor}; fill-rule: nonzero; opacity: 1;"  transform=" translate(-256, -256)" d="M 412.324 209.102 C 406.777 198.586 395.886 192 383.996 192 h -60.219 l 72.844 -145.688 c 4.953 -9.922 4.422 -21.703 -1.406 -31.133 C 389.386 5.742 379.09 0 367.996 0 h -160 c -13.781 0 -26 8.813 -30.359 21.883 l -80 240 c -3.25 9.758 -1.609 20.484 4.406 28.828 c 6.016 8.344 15.672 13.289 25.953 13.289 h 74.703 l -26.328 171.133 c -2.266 14.75 5.953 29.117 19.828 34.617 c 3.844 1.523 7.844 2.25 11.781 2.25 c 10.297 0 20.266 -4.977 26.391 -13.867 l 176 -256 C 417.105 232.336 417.855 219.617 412.324 209.102 z" stroke-linecap="round" />
        </g>`;
            offSetX += 150;
            contRestricoes += 1

        }

        //let tamIconeX = offSetX - 
        let widthX = contRestricoes * 25;
        let viewBoxX = (contRestricoes < 1) ? 0 : (contRestricoes * 150) - 1;
        //viewBoxX = viewBoxX<0?0:viewBoxX;

        var svgIcon = new L.divIcon({//vento trovoada teto visib
            // Specify a class name we can refer to in CSS.
            className: 'css-icon',
            html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" class = "${classSvgIcon}" width="${widthX}" height="50" viewBox="0 0 ${viewBoxX} 140" xml:space="preserve">
            <desc>Created with Fabric.js 3.6.3</desc>
            <defs>
            </defs>
            <rect x="0" y="0"  rx="30" ry ="30" width="100%" height="100%" fill="${backGroundColor}" fill-opacity="${boxOpacity}";></rect>
            ${svgVisibilidade}
            ${svgVento}
            ${svgTrovoada}
            ${svgTeto}
            </svg>`
            // Set marker width and height
            , iconSize: [25, 35] //tamanho minimo. O restante eh ajustado pelo tamanho do SVG
            , iconAnchor: [6, 6]
            , alt: parseInt(`${alt}`)

        });
        return svgIcon;
    }


    if (!isNaN(lat) && !isNaN(lng)) {
        let metar = getMetarFromLoc(loc)
        let indiceI
        let metarData
        if (metar.length < 5)
            indiceI = -1
        else {

            try {
                metarData = getI(metar)
                indiceI = metarData.indice
            } catch (e) {
                indiceI = -1
            }
        }
        desc = `<h5 style="${sombra3}">${spanBold(getDescricao(loc).toUpperCase())}</h5>`
        if (metarData && metarData.temp) {
            let strTemp = metarData.temp.t + "º"
            strTemp = insertSpanClass(spanColor(strTemp, strTemp, false, "black", true), sombra2)
            let strUR = parseInt(metarData.UR) + "%"
            strUR = insertSpanClass(spanColor(strUR, strUR, false, "black", true), sombra2)
            desc += `Temperatura do Ar: ${strTemp}<br>Umidade Relativa: ${strUR}` //+ '<br><br>'+ metar
            desc = spanBold(desc)
        }


        var greenIcon = new L.Icon({
            //            iconUrl: 'png/marker-icon-green.png',
            iconUrl: 'png/condicao_verde.png',
            //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [iconSize, iconSize],
            //iconAnchor: [0, 0],
            popupAnchor: [1, -12],
            shadowSize: [6, 6],
            alt: 0
        });

        var grayIcon = new L.Icon({
            //            iconUrl: 'png/marker-icon-green.png',
            iconUrl: 'png/condicao_cinza.png',
            //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [iconSize, iconSize],
            //iconAnchor: [0, 0],
            popupAnchor: [1, -12],
            shadowSize: [6, 6],
            alt: 0
        });

        var yellowIcon = new L.Icon({
            iconUrl: 'png/condicao_amarelo.png',
            //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [iconSize, iconSize],
            iconAnchor: [0, 0],
            popupAnchor: [1, -12],
            shadowSize: [6, 6],
            alt: 500
        });

        var orangeIcon = new L.Icon({
            iconUrl: 'png/condicao_laranja.png',
            //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [iconSize, iconSize],
            iconAnchor: [0, 0],
            popupAnchor: [1, -12],
            shadowSize: [6, 6],
            alt: 500
        });

        var redIcon = new L.Icon({
            //            iconUrl: 'png/marker-icon-green.png',
            iconUrl: 'png/condicao_vermelho.png',
            //shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [iconSize, iconSize],
            iconAnchor: [0, 0],
            popupAnchor: [1, -12],
            shadowSize: [6, 6],
            alt: 1000
        });

        var cssIconRed = new L.divIcon({
            // Specify a class name we can refer to in CSS.
            className: 'css-icon',
            html: '<div class="gps_ring"></div>'
            // Set marker width and height
            , iconSize: [28, 28]
            , iconAnchor: [13, 13]
        });

        var cssIconYellow = new L.divIcon({
            // Specify a class name we can refer to in CSS.
            className: 'css-icon',
            html: '<div class="gps_ringYellow"></div>'
            // Set marker width and height
            , iconSize: [24, 24]
            , iconAnchor: [48, 48]
        });

        let restricao = false

        restricao = true
        //desc = desc.substr(1)
        let descU = desc.toUpperCase();

        if (descU.includes("DESCOBERTO")) {
            let strDescoberto = descU.split("DESCOBERTO")[1].split("<")[0]
            let alerta = getTipoAlerta(loc, strDescoberto);
            //icon = redIcon
            icon = getSvgIcon(loc, alerta.strAlerta, adWRNGPertoDoFim, true) //vento trovoada teto visib

            //if (alerta.ad)
            addMarker(L.marker([lat, lng], { icon: cssIconRed }), "", restricao, true)
            updateDescobertos(loc, alerta)
        } else {
            let alerta = getTipoAlerta(loc);
            //if (descU.includes("DEGRADA"))
            // icon = orangeIcon
            //else {
            //icon = yellowIcon
            //icon = getSvgIcon(loc, alerta.strAlerta, adWRNGPertoDoFim, false) //vento trovoada teto visib

            //}
            //if (alerta.ad)
            //    addMarker(L.marker([lat, lng], { icon: cssIconYellow }), "", restricao, true)
        }
        let icon = false
        let strAlerta, strLegenda
        let strCDA = `<h5 style="${sombra2}">Orientações do CDA:</h5>`
	let strDC = `<h5 style="${sombra2}">Possíveis Orientações da Defesa Civil:</h5>`
        if (indiceI > 0 && indiceI < 3.35) {
            icon = greenIcon
            strAlerta = spanColor(strRiscoBaixo, strRiscoBaixo, false, "green", true)
            strAlerta = insertSpanClass(strAlerta, sombra2)
            strLegenda = "Atividade física liberada."
            strLegenda = spanBold(strLegenda)
        }
        else if (indiceI >= 3.35 && indiceI < 3.48) {
            icon = yellowIcon
            strAlerta = spanColor(strRiscoModerado, strRiscoModerado, false, "yellow", true)
            strAlerta = insertSpanClass(strAlerta, sombra3)
            strLegenda = "- Atividade física vigiada para não aclimatados ao calor (10 dias)<br>" +
                "- Cautela! Use água.<br>" +
                "- 1 copo 200 ml/20 min, beba gelada.<br>" +
                "- Borrifique água no corpo, molhe a cabeça e a nuca.<br>" +
                "- Alerta para os distúrbios térmicos."
            strLegenda = spanColor(strLegenda, "vigiada", false, "black", true)
            strLegenda = spanColor(strLegenda, "não aclimatados", false, "black", true)
            strLegenda = insertSpanClass(strLegenda, sombra2)
        }
        else if (indiceI >= 3.48 && indiceI < 3.55) {
            strAlerta = spanColor(strRiscoAlto, strRiscoAlto, false, "red", true)
            strAlerta = insertSpanClass(strAlerta, sombra2)
            icon = redIcon
            strLegenda = "- Atividade física suspensa para destreinados e não aclimatados (12 semanas)<br>" +
                "- Atividade física leve para treinados e aclimatados.<br>" +
                "- Cautelas! Pausas freqüentes! Use água.<br>" +
                "- Alerta para os distúrbios térmicos.<br>" +
                "- Não realizar o TACF."
            strLegenda = spanColor(strLegenda, "suspensa", false, "black", true)
            strLegenda = spanColor(strLegenda, "destreinados e não aclimatados", false, "black", true)
            strLegenda = spanColor(strLegenda, "Não realizar o TACF", false, "red", true)
            strLegenda = insertSpanClass(strLegenda, sombra2)

        }
        else if (indiceI >= 3.55 || (metarData && metarData.temp > 39)) {
            strAlerta = spanColor(strRiscoMuitoAlto, strRiscoMuitoAlto, false, "black", true)
            icon = grayIcon
            strLegenda = "- Atividade física suspensa para todos.<br>" +
                "- Não realizar o TACF."

            strLegenda = spanColor(strLegenda, "suspensa para todos", false, "black", true)
            strLegenda = spanColor(strLegenda, "Não realizar o TACF", false, "red", true)
            strLegenda = insertSpanClass(strLegenda, sombra2)

            addMarker(L.marker([lat, lng], { icon: cssIconRed }), "", true, true)


        }
        let strLegendaDC=""
        if (metarData && metarData.UR) {
            let UR = parseInt(metarData.UR)
            if (UR >= 80 && UR <= 90) {
            //if (UR >= 20 && UR <= 30) {
                strLegendaDC += "- Possível estado de Atenção em sua região.<br><br>" 
                strLegendaDC += "- Recomendações: <br>" 
                strLegendaDC += "- Evitar exercícios físicos ao ar livre entre 11h e 15h; permanecer em locais protegidos do sol, em áreas vegetadas.<br>" 
                strLegendaDC += "- Consulte a Defesa Civil de seu estado para confirmação.<br>" 
            	strLegendaDC = spanColor(strLegendaDC, "Atenção", false, "black", true)
		    
            }
            if (UR >= 52 && UR < 80) {
            //if (UR >= 12 && UR < 20) {
                strLegendaDC += "- Possível estado de Alerta em sua região.<br><br>" 
                strLegendaDC += "- Recomendações: <br>" 
                strLegendaDC += "- Suprimir exercícios físicos e trabalhos ao ar livre entre 10h e 16h; evitar aglomerações em ambientes fechados.<br>" 
                strLegendaDC += "- Consulte a Defesa Civil de seu estado para confirmação.<br>" 
            	strLegendaDC = spanColor(strLegendaDC, "Alerta", false, "black", true)
            }
            if (UR < 52) {
            //if (UR < 12) {
                strLegendaDC += "- Possível estado de Emergência em sua região.</p><br>" 
                strLegendaDC += "- Recomendações: </p>" 
                strLegendaDC += "- Suprimir exercícios físicos e trabalhos ao ar livre entre 10h e 16h; suspender atividades que exijam aglomeração de pessoas em recintos fechados entre 10h e 16h.</p>" 
                strLegendaDC += "- Consulte a Defesa Civil de seu estado para confirmação.</p>" 
            	strLegendaDC = spanColor(strLegendaDC, "Emergência", false, "black", true)
            }
            if (strLegendaDC.length > 0) { 
            	strLegendaDC = insertSpanClass(strLegendaDC, sombra2)
            	strLegendaDC = '<br>' + strDC + strLegendaDC
	    }
        }

        if (!icon)
            return false

        let strInfoICA = spanBold("Fonte:") + " * Quadro 3.2, Página 22 - NSCA 54-5/2020"
        //let strInfoICA = spanBold("Fonte:") + " * Quadro 3.1, Página 21 - ICA 54-3/2007"
        desc = `${desc}<br><br>${strCDA}<h5>${strAlerta}</h5>${strLegenda}${strLegendaDC}<br><br>${strInfoICA}`

        var m = addMarker(L.marker([lat, lng], { icon: icon }), loc, restricao)

        //m._icon.classList.add("svgRedIcon");


        m.on('contextmenu', function (event) {
            let d
            d = removeEspacos(event.target.getTooltip()._content)
            selectedMarker = d.replace("METARCOR", "").replace("SPECICOR", "").replace("METAR", "").replace("SPECI", "").substr(0, 4)
            openContextMenuMarker(event, event.target);
        }, this);

        m.bindTooltip(desc, { closeButton: false, offset: L.point(0, -20) })
    }
}


/*$(document).ready(function ()

{
    temp = getTempMetar("METAR SBGM 161400Z 25003KT 200V290 6000 BKN004 40/17 Q1013=")
    let UR = getUR(temp)
	
    console.log("Umidade: " + parseInt(UR) + "%")
	
    console.log("I:" + getI(temp,UR))
       
       
});
*/

function getTempMetar(metar) { //programado apenas para pressao em Q

    let patt2 = /\d{2}\/\d{2} Q/;
    let t = metar.match(patt2)
    //console.log(t)
    if (!Array.isArray(t))
        return false
    t = t[0].split("/")

    return { t: parseInt(t[0]), td: parseInt(t[1].split(" ")[0]) }
}

function getUR(temp) {
    let neper = 2.7182818285

    //console.log("=>" + temp.t+" "+temp.td)

    let n1 = 6.112 * Math.pow(neper, (17.67 * temp.td) / (temp.td + 243.5))

    //console.log(n1)
    let n2 = 6.112 * Math.pow(neper, (17.67 * temp.t) / (temp.t + 243.5))
    //console.log(n2)
    let UR = 100 * (n1 / n2)
    return UR
}

function getI(metar) {
    let temp = getTempMetar(metar)
    if (!temp)
        return { temp: false, UR: false, indice: -1 }
    let UR = getUR(temp)

    let i = Math.pow(temp.t, (1 / 4)) * Math.pow(UR, (3 / 32))
    i = Math.round(i * 1000) / 1000
    return { temp, UR, indice: i }
}
