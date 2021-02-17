const extendMap = () => {
  M.Map.prototype.geopackages = [];

  M.Map.prototype.addGeoPackage = function addGeoPackage(layersParamVar) {
    let layersParam = layersParamVar;
    if (!M.utils.isNullOrEmpty(layersParam)) {
      if (!M.utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      layersParam.forEach((geopackageLayer) => {
        if (geopackageLayer && geopackageLayer.type === M.layer.type.GeoPackage) {
          geopackageLayer.addTo(this);
          this.geopackages.push(geopackageLayer);
        }
      });
      this.fire(M.evt.ADDED_LAYER, [this.geopackages]);
      this.fire('added:geopackage', [this.geopackages]);
    }
    return this;
  };

  M.Map.prototype.removeGeoPackage = function removeGeoPackage(layersParamVar) {
    let layersParam = layersParamVar;
    if (!M.utils.isNullOrEmpty(layersParam)) {
      if (!M.utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const geopackageLayers = layersParam.filter(layerParam => layerParam &&
        layerParam.type === M.layer.type.GeoPackage);
      geopackageLayers.forEach((geopackageLayer) => {
        geopackageLayer.removeLayers();
        this.geopackages = this.geopackages
          .filter(geopackage => !geopackage.equals(geopackageLayer));
      });

      this.fire(M.evt.REMOVED_LAYER, [geopackageLayers]);
    }
    return this;
  };

  M.Map.prototype.getGeoPackage = function getGeoPackage() {
    return this.geopackages;
  };

  M.Map.prototype.addGeoPackageTile = function addGeoPackageTile(layersParamVar) {
    let layersParam = layersParamVar;
    if (!M.utils.isNullOrEmpty(layersParam)) {
      if (!M.utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const layers = [];
      layersParam.forEach((layerParam) => {
        let geoPackageTile;
        if (M.utils.isObject(layerParam) && (layerParam.type === M.layer.type.GeoPackageTile)) {
          geoPackageTile = layerParam;
        }
        layers.push(geoPackageTile);
      });

      this.getImpl().addGeoPackageTile(layers);
      this.fire(M.evt.ADDED_LAYER, [layers]);
      this.fire(M.evt.ADDED_GEOPACKAGE_TILE, [layers]);
    }
    return this;
  };

  M.Map.prototype.getGeoPackageTile = function getGeoPackageTile(filters) {
    const layers = this.getImpl().getGeoPackageTile(filters).sort(M.Map.LAYER_SORT);

    return layers;
  };

  M.Map.prototype.removeGeoPackageTile = function removeGeoPackageTile(layersParam) {
    if (!M.utils.isNullOrEmpty(layersParam)) {
      const layers = this.getGeoPackageTile(layersParam);
      if (layers.length > 0) {
        layers.forEach((layer) => {
          this.getFeatureHandler().removeLayer(layer);
        });
        this.getImpl().removeGeoPackageTile(layers);
      }
    }
    return this;
  };
};


export default extendMap;
