import model from '../models';
const { Metafield } = model;

class MetafieldService {
  constructor() {}

  createString(metafield) {
    return this.create({
      ...metafield,
      type: 'string',
    });
  }

  createInteger(metafield) {
    return this.create({
      ...metafield,
      type: 'integer',
    });
  }

  bulkCreateString(metafields) {
    return this.bulkCreate(
      metafields.map((metafield) => ({
        ...metafield,
        type: 'string',
      }))
    );
  }

  bulkCreateInteger(metafields) {
    return this.bulkCreate(
      metafields.map((metafield) => ({
        ...metafield,
        type: 'integer',
      }))
    );
  }

  bulkCreate(metafields) {
    return Metafield.bulkCreate(metafields);
  }

  create(metafield) {
    return Metafield.create(metafield);
  }

  getById(id) {
    return Metafield.findByPk(id);
  }

  getAll(owner_id, owner_type, namespace) {
    return Metafield.findAll({ where: { owner_id, owner_type, namespace } });
  }

  update(id, updated) {
    return Metafield.update(updated, { where: { id } });
  }

  delete(id) {
    return Metafield.destroy({
      where: {
        id,
      },
    });
  }

  deleteAll({ owner_id, owner_type, namespace, key }) {
    return Metafield.destroy({
      where: { owner_id, owner_type, namespace, key },
    });
  }
}

const _metafieldService = new MetafieldService();
export default _metafieldService;
