# Mapea GeoPackage
---
Extensión de Mapea para el soporte de carga de ficheros locales .gpkg.

Node version >= 12.X.X

## Desarrollo
1. Instalar dependencias `npm install`

2. Desplegar servidor de desarrollo `npm start`

3. Se abrirá el navegador con la página de test.

## Compilación
En la carpeta properties se encuentran los diferentes ficheros para configurar el perfil deseado.

Para compilar con un perfil concreto
```bash
$ npm run build -- -P <perfil>
```

### Parámetros configurables

- M.config.SQL_WASM_URL: Este parámetro de configuración indica donde se encuentra el fichero sql-wasm.wasm necesario para la librería SQL.js que se usa como dependencia para la conexión con los ficheros GeoPackage. Para entornos de producción este fichero debe estar disponible desde un servidor que provea del fichero [sql-wasm.wasm](https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.4.0/dist/sql-wasm.js)



)

## Uso

Pasamos a mostrar un ejemplo general de explotación

index.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Mapea GeoPackage TEST</title>
    <link href="https://URL/js/mapea-6.0.0.ol.min.css" rel="stylesheet" />
    <style rel="stylesheet">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
    </style>

</head>

<body>
    <div id="map" class="container"></div>
    <script type="text/javascript" src="https://URL/js/mapea-6.0.0.ol.min.js"></script>
    <script type="text/javascript" src="https://URL/js/configuration-6.0.0.js"></script>
    <script type="text/javascript" src="https://URL/js/mapea-geopackage-1.0.0.ol.min.js"></script>
    <script>
        const mapjs = M.map({
          container: 'map',
          projection: 'EPSG:3857*m',
          controls: ['layerswitcher', 'panzoom'],
          layers: ['OSM'],
        });

        fetch(URL_FILE_GPKG).then((response) => {
          const gpkg = new GeoPackage(response);
          mapjs.addGeoPackage(gpkg);
        });
    </script>
</body>

</html>

```

## Documentación API Mapea-GeoPackage

### class M.layer.GeoPackage

- Constructor:

  new M.layer.GeoPackage(data, options)

  data: El fichero  que contiene la información de geopackage (.gkpg). Tipo: [Response](https://developer.mozilla.org/es/docs/Web/API/Response) |
  [File](https://developer.mozilla.org/es/docs/Web/API/File) |
  [Uint8Array](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Uint8Array)

  options: El objeto de opciones para pasarle a las diferentes capas que contiene GeoPackage. Si son vectoriales se instancian con M.layer.GeoJSON, si son raster se usa la clase M.layer.GeoPackageTile.
  Estructura:
  ```javascript
  const options = {
    id_capa_vectorial_en_geopackage: {
      name, // Nombre interno de la capa. Opcional
      legend, // Leyenda para mostrar en TOC. Opcional
      extract, // Permite consultar los atributos. Opcional
    },
    id_capa_raster_en_geopackage: {
      transparent, // Establece si la capa es base. Opcional
      extent, // Extensión de la capa. Opcional
      name, // Nombre interno de la capa. Opcional
      legend, // Leyenda para mostrar en TOC. Opcional
      visibility, // Establece si la capa está visible. Opcional
      opacity: // Establece la opacidad de la capa. Opcional
    }
  }


  ```
- Eventos

  - M.evt.LOAD_LAYERS
### Extensiones de M.Map

- M.Map.prototype.addGeoPackage

- M.Map.prototype.getGeoPackage

- M.Map.prototype.removeGeoPackage

### Extensiones de M.layer.type

- M.layer.type.GeoPackage
- M.layer.type.GeoPackageTile

## Matriz de compatibilidad
| Mapea-GeoPackage | Mapea   |
| ---------------- | ------- |
| 1.0.0            | >=6.0.0 |
