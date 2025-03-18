export function getMetafieldValue(metafield, namespace, key) {
  const result = metafield.find((mf) => mf.namespace === namespace && metafield.key === key);
  return result ? result.value : null;
}

export function getMetafieldValues(metafield, namespace, key) {
  const values = [];
  Array.isArray(metafield) &&
    metafield.forEach((mf) => {
      if (mf.namespace === namespace && mf.key === key) {
        let value = mf.value;
        if (mf.type === 'integer') {
          value = parseInt(value);
        }
        if (mf.type === 'json') {
          value = JSON.parse(value);
        }
        values.push(value);
      }
    });
  return values;
}
