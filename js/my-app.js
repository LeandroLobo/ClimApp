  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/index/',
        url: 'index.html',
      },
    ]
    // ... other parameters img/fondo2.jpg
  });

var mainView = app.views.create('.view-main');
var infoLocal, infoExtendida, cityId, latitud, longitud, APIkey='cae65ddeda9420d78950c84875aac603';
const tilesProvider='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    console.log(e);
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    console.log(e);
    var abrirPopup=app.popup.open(".popup-inicio");
    $$('#iniciar').on('click',crearMapaLocal);
})

/*****************************************************************************************/

function onSuccess(position) {
    latitud=position.coords.latitude;
    longitud=position.coords.longitude;
    obtenerInfoLocal();
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}


function obtenerInfoLocal(){
    url="https://api.openweathermap.org/data/2.5/weather?lat="+latitud+"&lon="+longitud+"&appid="+APIkey+"&lang=es";
    app.request.json(url,function(datosActual){
        infoLocal=JSON.parse(JSON.stringify(datosActual));
    });
}

function crearMapaLocal(){
    temp=parseInt((infoLocal.main.temp-273.15).toFixed(2));
    feels_like=parseInt((infoLocal.main.feels_like-273.15).toFixed(2));
    var mymap = L.map('mapid').setView([latitud, longitud], 11);
    L.tileLayer(tilesProvider, {
        minZoom:4,
        maxZoom: 18
    }).addTo(mymap);
    var marker = L.marker([latitud, longitud]).addTo(mymap);
    L.marker([latitud, longitud]).addTo(mymap).bindPopup(temp+' °C').openPopup();
    $$('#ciudadLocal').html(infoLocal.name+', '+infoLocal.sys.country);
    $$('#tempLocal').html(temp+'°C');
    $$('#termicaLocal').html('Sensación Térmica: '+feels_like+' °C');
    $$('#presionLocal').html('Presión: '+infoLocal.main.pressure+' hPa');
    $$('#humedadLocal').html('Humedad: '+infoLocal.main.humidity+'%');
    $$('#descripcionLocal').html(infoLocal.weather[0].description);
    $$('#visibilidadLocal').html('Visibilidad: '+(infoLocal.visibility/1000)+' km');
    $$('#imgID').attr('src','http://openweathermap.org/img/wn/'+infoLocal.weather[0].icon+'@2x.png');
}
