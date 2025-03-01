export function getIdAndType(item) {
  if (item && item.item_type === 'finished_product') {
    return { item_id: item.item.id, item_type: item.item_type };
  } else if (item) {
    return { item_id: item.raw.id, item_type: item.item_type };
  }
  return { item_id: null, item_type: null };
}

export function filterItemsAndRaw(type, items, raw) {
  if (type === 'finished_product') {
    return items;
  }
  if (type === 'raw_material') {
    return raw.filter((r) => r.type === 'raw_material');
  }
  if (type === 'packaging_material') {
    return raw.filter((r) => r.type === 'packaging_material');
  }
  return [];
}

export function getItemsAndRaw(type = '', items = [], raw = []) {
  const result = filterItemsAndRaw(type, items, raw);
  return result.map((item) => ({
    id: item.id,
    label: item.name,
    unit: item.unit_of_measure
  }));
}
