const extendMap = () => {
  M.impl.Map.Z_INDEX[M.layer.type.GeoPackageTile] = 2000;
  M.impl.Map.registerBaseLayerType(M.layer.type.GeoPackageTile);

  M.impl.Map.prototype.addGeoPackageTile = function addGeoPackageTile(layers) {
    const baseLayers = this.getBaseLayers();
    let existsBaseLayer = baseLayers.length > 0;

    const addedLayers = [];
    layers.forEach((layer) => {
      if (layer.type === M.layer.type.GeoPackageTile) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          addedLayers.push(layer);
          layer.setZIndex(layer.getZIndex());
          if (layer.getZIndex() == null) {
            const zIndex = this.layers_.length + M.impl.Map.Z_INDEX[M.layer.type.GeoPackageTile];
            layer.setZIndex(zIndex);
          }
        }

        if (layer.transparent !== true) {
          layer.setVisible(!existsBaseLayer);
          existsBaseLayer = true;
          layer.setZIndex(M.impl.Map.Z_INDEX_BASELAYER);
        } else if (layer.getZIndex() == null) {
          const zIndex = this.layers_.length + M.impl.Map.Z_INDEX[M.layer.type.GeoPackageTile];
          layer.setZIndex(zIndex);
        }
      }
    });

    // calculate resolutions if layers were added and there is not any base layer
    // or if some base layer was added
    const calculateResolutions = (addedLayers.length > 0 && !existsBaseLayer) ||
      addedLayers.some(l => l.transparent !== true && l.isVisible());
    if (calculateResolutions) {
      this.updateResolutionsFromBaseLayer();
    }

    return this;
  };

  M.impl.Map.prototype.getGeoPackageTile = function getGeoPackageTile(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;

    const layers = this.layers_.filter((layer) => {
      return (layer.type === M.layer.type.GeoPackageTile);
    });

    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = layers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredLayers = layers.filter((layer) => {
          let layerMatched = true;
          if (!foundLayers.includes(layer)) {
            if (!M.utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === layer.type));
            }
            if (!M.utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === layer.name));
            }
          } else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredLayers);
      });
    }
    return foundLayers;
  };

  M.impl.Map.prototype.removeGeoPackageTile = function removeGeoPackageTile(layersParam) {
    const tileLayers = this.getGeoPackageTile(layersParam);
    tileLayers.forEach((tileLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(tileLayer));
      tileLayer.getImpl().destroy();
      tileLayer.fire(M.evt.REMOVED_FROM_MAP, [tileLayer]);
    });

    return this;
  };

  M.impl.Map.registerExternalFunction('addGeoPackageTile', 'addLayers');
  M.impl.Map.registerExternalFunction('getGeoPackageTile', 'getLayers');
  M.impl.Map.registerExternalFunction('removeGeoPackageTile', 'removeLayers');
};


export default extendMap;
