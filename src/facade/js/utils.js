/**
 * @private
 * @function
 * @param {Uint8Array} bytes
 */
export const bytesToBase64 = (bytes, format = 'image/png') => {
  const base64abc = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/',
  ];

  let result = '';
  let i;
  const l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0F) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3F];
  }
  if (i === l + 1) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += '==';
  }
  if (i === l) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0F) << 2];
    result += '=';
  }
  return `data:${format};base64,${result}`;
};

/**
 * @function
 * @param {File|ArrayBuffer|Response|Uint8Array} data
 * @return {Uint8Array}
 */
export const getUint8ArrayFromData = (data) => {
  return new Promise((resolve, reject) => {
    let uint8Array = new Uint8Array();
    if (data instanceof ArrayBuffer) {
      uint8Array = new Uint8Array(data);
      resolve(uint8Array);
    } else if (data instanceof File) {
      data.arrayBuffer().then((buffer) => {
        uint8Array = new Uint8Array(buffer);
        resolve(uint8Array);
      });
    } else if (data instanceof Response) {
      resolve(data.arrayBuffer().then(getUint8ArrayFromData));
    } else if (data instanceof Uint8Array) {
      resolve(data);
    } else {
      resolve(uint8Array);
    }
  });
};
