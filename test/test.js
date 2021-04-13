import GeoPackage from 'facade/GeoPackage';

const mapjs = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher', 'panzoom'],
  layers: ['OSM'],
});

fetch('/test/rivers.gpkg').then((response) => {
  const gpkg = new GeoPackage(response);
  mapjs.addGeoPackage(gpkg);
});
window.mapjs = mapjs;
