/**
 * @module M/impl/layer/GeoPackageTile
 */
import extend from './prototype-extend';

extend();
const DEFAULT_WHITE_TILE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAABu0lEQVR42u3SQREAAAzCsOHf9F6oIJXQS07TxQIABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAgAACwAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAAsAEAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAKg9kK0BATSHu+YAAAAASUVORK5CYII=';

/**
 * @classdesc
 * @api
 */
class GeoPackageTile extends M.impl.Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GeoPackageTile implementation layer
   * with parameters specified by the user
   *
   * @constructor
   * @api
   */
  constructor(userParameters, provider) {
    // calls the super constructor
    super({}, {});

    /**
     * User tile load function
     * @public
     * @type {function}
     */
    this.tileLoadFunction = userParameters.tileLoadFunction || null;

    /**
     * Layer extent
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent_ = userParameters.maxExtent || null;

    /**
     * Layer opacity
     * @private
     * @type {number}
     */
    this.opacity_ = typeof userParameters.opacity === 'number' ? userParameters.opacity : 1;

    /**
     * Z Index of layer
     * @private
     * @type {number}
     */
    this.zIndex_ = typeof userParameters.zIndex === 'number' ? userParameters.zIndex : M.impl.Map.Z_INDEX[M.layer.type.GeoPackageTile];

    /**
     * Visibility of layer
     * @private
     * @type {boolean}
     */
    this.visibility = userParameters.visibility === false ? userParameters.visibility : true;

    /**
     * Tile size
     * @private
     * @type {number}
     */
    this.tileSize_ = userParameters.tileSize || 256;

    /**
     * Extent of the layer
     * @private
     * @type {number}
     */
    this.extent_ = userParameters.extent || null;

    /**
     * Minimum zoom
     * @private
     * @type {number}
     */
    this.minZoom_ = userParameters.minZoom || null;

    /**
     * Maximum zoom
     * @private
     * @type {number}
     */
    this.maxZoom_ = userParameters.maxZoom || null;

    /**
     * Tile provider
     * @private
     * @type {GeoPackageTileProvider}
     */
    this.provider = provider;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api
   */
  setVisible(visibility) {
    this.visibility = visibility;
    // if this layer is base then it hides all base layers
    if ((visibility === true) && (this.transparent !== true)) {
      // hides all base layers
      this.map.getBaseLayers().forEach((layer) => {
        if (!layer.equals(this.facadeLayer_) && layer.isVisible()) {
          layer.setVisible(false);
        }
      });

      // set this layer visible
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }

      // updates resolutions and keep the bbox
      this.map.getImpl().updateResolutionsFromBaseLayer();
    } else if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  /**
   * This method gets the visibility of the layer
   * @function
   * @return {boolean}
   * @api
   */
  isVisible() {
    return this.visibility;
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @api
   */
  addTo(map) {
    let tileLoadFn = this.loadTileWithProvider;
    if (this.tileLoadFunction) {
      tileLoadFn = this.loadTile;
    }

    this.map = map;
    const { code } = this.map.getProjection();
    const projection = ol.proj.get(code);
    const extent = this.extent_ || this.provider.getExtent();
    const minZoom = this.minZoom_ || this.provider.getMinZoom();
    const maxZoom = this.maxZoom_ || this.provider.getMaxZoom();

    this.ol3Layer = new ol.layer.Tile({
      visible: this.visibility,
      opacity: this.opacity_,
      zIndex: this.zIndex_,
      extent,
      source: new ol.source.XYZ({
        wrapX: false,
        minZoom,
        maxZoom,
        projection,
        tileUrlFunction: coord => `{${coord[2]}},{${coord[0]}},{${coord[1]}}`,
        tileLoadFunction: tile => tileLoadFn(tile, this),
      }),
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);
  }

  /**
   * This function load the image tile from x y z coordinates.
   *
   * @param {M/geopackage/TileProvider} tile
   * @function
   * @api
   */
  loadTileWithProvider(tile, target) {
    const imgTile = tile;
    const [z, x, y] = tile.getTileCoord();
    target.provider.getTile(x, y, z).then((imgSrc) => {
      imgTile.getImage().src = imgSrc;
    });
  }

  /**
   * This function is the custom tile loader function of
   * TileLayer
   * @param {ol/Tile} tile
   * @param {M/provider/Tile} tileProvider
   * @function
   * @api
   */
  loadTile(tile, target) {
    const imgTile = tile;
    const [z, x, y] = tile.getTileCoord();
    target.tileLoadFunction(x, y, z).then((tileSrc) => {
      if (tileSrc) {
        imgTile.getImage().src = tileSrc;
      } else {
        imgTile.getImage().src = DEFAULT_WHITE_TILE;
      }
    });
  }

  /**
   * This function set facade layer GeoPackageTile
   *
   * @function
   * @api
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * This function sets the maximum extent of the layer
   */
  setMaxExtent(maxExtent) {
    this.ol3Layer.setExtent(maxExtent);
  }

  /**
   *
   * @public
   * @function
   * @api
   */
  getMinResolution() {}

  /**
   *
   * @public
   * @function
   * @api
   */
  getMaxResolution() {}

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeoPackageTile) {
      equals = (this.name === obj.name);
    }

    return equals;
  }

  /**
   * This function gets the layer extent from the mbtile file.
   * @function
   * @return {Promise<array<number>>}
   * @api
   */
  getExtentFromProvider() {
    return new Promise((resolve) => {
      const extent = this.provider.getExtent();
      resolve(extent);
    });
  }

  /**
   * This methods returns a layer clone of this instance
   * @return {ol/layer/Tile}
   */
  cloneOLLayer() {
    let olLayer = null;
    if (this.ol3Layer != null) {
      const properties = this.ol3Layer.getProperties();
      olLayer = new ol.layer.Tile(properties);
    }
    return olLayer;
  }
}

export default GeoPackageTile;
