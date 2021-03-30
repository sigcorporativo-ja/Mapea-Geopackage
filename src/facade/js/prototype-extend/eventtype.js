const extendEventType = () => {
  M.evt.ADDED_GEOPACKAGE = 'added:geopackage';
  M.evt.ADDED_GEOPACKAGE_TILE = 'added:geopackagetile';
  M.evt.ADDED_GEOPACKAGE_VECTOR = 'added:geopackagevector';
};

export default extendEventType;
