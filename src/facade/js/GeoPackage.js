/**
 * @module M/layer/GeoPackage
 */
import 'configuration';
import './prototype-extend';
import GeoPackageProvider from './GeoPackageConnector.js';
import GeoPackageTile from './GeoPackageTile.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Geopackage layer
 * with parameters specified by the user*
 * @api
 */
class GeoPackage extends M.Object {
  /**
   * @constructor
   * @extends {MObject}
   * @api
   */
  constructor(data, options = {}) {
    super({});

    /**
     * Id of the GeoPackage
     * @type{}
     * @private
     */
    this.id_ = M.utils.generateRandom('GeoPackage_');

    /**
     * Layers of the geopackage
     * @type {M/layer/GeoPackageTile|M/layer/GeoJSON}
     * @private
     */
    this.layers_ = {};

    /**
     * Geopackage connector
     * @type {provider/GeoPackage}
     * @private
     */
    this.connector_ = new GeoPackageProvider(data, options);

    /**
     * Options paramenter
     * @type {object}
     * @public
     */
    this.options = options;

    /**
     * Attribute loaded vector layers flag.
     * @private
     * @type {boolean}
     */
    this.loadedVectorLayers_ = false;

    /**
     * Attribute loaded vector layers flag.
     * @private
     * @type {boolean}
     */
    this.loadedTileLayers_ = false;
  }

  /**
   * This functions gets the id of the GeoPackage
   * @public
   * @function
   * @api
   */
  getId() {
    return this.id_;
  }

  /**
   * This functions get the type layer of GeoPackage
   * @public
   * @function
   * @api
   */
  get type() {
    return M.layer.type.GeoPackage;
  }

  /**
   * This method adds the layers of geopackage
   * @function
   * @param {M/Map} map
   * @api
   */
  addTo(map) {
    this.map_ = map;
    this.connector_.getVectorProviders().then((vectorProviders) => {
      vectorProviders.forEach((vectorProvider) => {
        const geojson = vectorProvider.getGeoJSON();
        const tableName = vectorProvider.getTableName();
        const optsExt = M.utils.extend(this.options[tableName] || {}, { name: tableName });
        const vectorLayer = new M.layer.GeoJSON({
          ...optsExt,
          source: geojson,
        });

        this.layers_[tableName] = vectorLayer;
        map.addLayers(vectorLayer);
      });

      this.loadedVectorLayers_ = true;

      if (this.loadedTileLayers_) {
        this.fire(M.evt.LOAD_LAYERS, [this.layers_]);
      }
    });

    this.connector_.getTileProviders().then((tileProviders) => {
      tileProviders.forEach((tileProvider) => {
        const tableName = tileProvider.getTableName();
        const optsExt = M.utils.extend(this.options[tableName] || {}, {
          name: tableName,
          legend: tableName,
        });
        const tileLayer = new GeoPackageTile(optsExt, tileProvider);

        this.layers_[tableName] = tileLayer;
        map.addLayers(tileLayer);
      });
      this.loadedTileLayers_ = true;

      if (this.loadedVectorLayers_) {
        this.fire(M.evt.LOAD_LAYERS, [this.layers_]);
      }
    });
  }

  /**
   * This method gets the layers of geopackage
   * @function
   * @return {array<M/layer/GeoPackageTile|M/layer/GeoJSON>}
   * @api
   */
  getLayers() {
    return Object.values(this.layers_);
  }

  /**
   * This method gets the layer of geopackage by table name
   * @function
   * @param {string} tableName
   * @return {M/layer/GeoPackageTile|M/layer/GeoJSON}
   * @api
   */
  getLayer(tableName) {
    return this.layers_[tableName] || null;
  }

  /**
   * This method removes all layers of geopackage
   * @function
   * @api
   */
  removeLayers() {
    this.map_.removeLayers(this.getLayers());
  }

  /**
   * This method remove the layer of geopackage by table name
   * @function
   * @param {string} tableName
   * @api
   */
  removeLayer(tableName) {
    this.map_.removeLayers(this.getLayer(tableName));
  }

  /**
   * Checks if an object is equal to this GeoPackage.
   *
   * @function
   * @param {Object} obj Object to to comapre
   * @return {boolean} True if equal, false otherwise
   * @public
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeoPackage) {
      equals = this.id === obj.id;
    }

    return equals;
  }
}

export default GeoPackage;
