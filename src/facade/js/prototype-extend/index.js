import extendMap from './Map.js';
import extendLayerType from './LayerType.js';
import extendEventType from './eventtype.js';

const extend = () => {
  extendMap();
  extendLayerType();
  extendEventType();
};

extend();
