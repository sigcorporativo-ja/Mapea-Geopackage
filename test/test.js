import GeoPackage from 'facade/GeoPackage';

const mapjs = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  controls: ['layerswitcher', 'panzoom'],
  layers: ['OSM'],
});

fetch('/test/rivers.gpkg').then((response) => {
  const gpkg = new GeoPackage(response, {
    rivers: {
      name: 'rios',
      legend: 'Rios (Formato Vectorial)',
      extract: true
    },
    rivers_tiles: {
      name: 'tile_rios',
      legend: 'Rios (Formato Ráster)',
      visibility: false,
      opacity: 1,
      extent: [-1314457, 4045910, 586206, 5568052]
    }
  });
  mapjs.addGeoPackage(gpkg);
});

window.mapjs = mapjs;