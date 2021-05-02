import L from 'leaflet';

// Open Street Map
const osmTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
});

// Open Topo Map
const openTopoMapTile = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// IGN plan
const ignTile = L.tileLayer('https://wxs.ign.fr/choisirgeoportail/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&format=image/png&style=normal', {
  attribution: "IGN-F/Géoportail"
});

// IGN satellite
const ignPhotosTile = L.tileLayer('https://wxs.ign.fr/choisirgeoportail/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=ORTHOIMAGERY.ORTHOPHOTOS&format=image/jpeg&style=normal', {
  opacity: 0.5,
  attribution: "IGN-F/Géoportail"
});

export const baseMaps = {
  "OpenStreetMap": osmTile,
  "OpenTopoMap": openTopoMapTile,
  "IGN": ignTile
};

export const overlays = {
  "IGN satellite": ignPhotosTile
};

// Default icon (needed because of path that would not be correct otherwise)
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
export const markerDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export const markerRed = new L.Icon({
  iconRetinaUrl: "assets/img/markers/marker-icon-2x-red.png",
  iconUrl: "assets/img/markers/marker-icon-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const markerYellow = new L.Icon({
  iconRetinaUrl: "assets/img/markers/marker-icon-2x-yellow.png",
  iconUrl: "assets/img/markers/marker-icon-yellow.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const markerGreen = new L.Icon({
  iconRetinaUrl: "assets/img/markers/marker-icon-2x-green.png",
  iconUrl: "assets/img/markers/marker-icon-green.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
