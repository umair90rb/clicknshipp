import model from '../models';
const { Item, RawMaterial, BOM, BOMItem, BOMMaterialQuantityUpdateReason } =
  model;

class BillOfMaterialService {
  get(id) {
    return BOM.findByPk(id, {
      attributes: [
        'id',
        'name',
        'quantity',
        'unit_of_measure',
        'status',
        'createdAt',
      ],
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name'],
        },
        {
          model: BOMItem,
          as: 'materials',
          attributes: ['id', 'quantity', 'unit_of_measure'],
          include: {
            model: RawMaterial,
            as: 'raw',
            attributes: ['id', 'name'],
          },
        },
      ],
    });
  }

  setStatus(id, status) {
    return BOM.update({ status }, { where: { id } });
  }
}

const _billOfMaterialService = new BillOfMaterialService();
export default _billOfMaterialService;
