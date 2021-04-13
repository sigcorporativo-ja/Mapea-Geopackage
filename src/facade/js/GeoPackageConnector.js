import sqljs from 'sql.js';
import { GeoPackageConnection, GeoPackage } from '@ngageoint/geopackage';
import GeoPackageTile from './TileProvider.js';
import GeoPackageVector from './VectorProvider.js';
import { getUint8ArrayFromData } from './utils.js';

/**
 * @classdesc
 */
class GeoPackageConnector {
  /**
   * @constructor
   * @param {ArrayBuffer} data
   */
  constructor(data, { tile, vector } = {}) {
    /**
     * Tile geopackage options
     * @private
     */
    this.tileOpts_ = tile || {};

    /**
     * Tile geopackage options
     * @private
     */
    this.vectorOpts_ = vector || {};

    /**
     * Vector geopackage providers
     * @private
     */
    this.vectorProviders_ = [];

    /**
     * Tile geopackage providers
     * @private
     */
    this.tileProviders_ = [];

    /**
     * GeoPackage object that provides access to .gpkg data.
     * @private
     * @type {geopackage/GeoPackage}
     */
    this.gpkg_ = null;

    /**
     * Tile height
     * @private
     * @type {number}
     */

    this.init(data);
  }

  init(data) {
    this.initPromise_ = new Promise((resolve, reject) => {
      sqljs({
        locateFile: (file) => {
          const URL = `${M.config.SQL_WASM_URL}${file}`;
          return URL;
        },
      }).then((SQL) => {
        getUint8ArrayFromData(data).then((uint8Array) => {
          const db = new SQL.Database(uint8Array);
          GeoPackageConnection.connectWithDatabase(db).then((conn) => {
            this.gpkg_ = new GeoPackage('', '', conn);
            const { features, tiles } = this.gpkg_.getTables();
            this.tileProviders_ = tiles
              .map(name => new GeoPackageTile(this.gpkg_, name, this.tileOpts_[name]));
            this.vectorProviders_ = features
              .map(name => new GeoPackageVector(this.gpkg_, name, this.vectorOpts_[name]));

            resolve({
              tileProviders: this.tileProviders_,
              vectorProviders: this.vectorProviders_,
            });
          });
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  getVectorProviders() {
    return this.initPromise_.then(({ vectorProviders }) => vectorProviders);
  }

  getTileProviders() {
    return this.initPromise_.then(({ tileProviders }) => tileProviders);
  }
}

export default GeoPackageConnector;
