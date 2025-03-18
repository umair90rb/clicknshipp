import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _metafieldService from '../services/MetafieldService';
import {
  metafieldOwners,
  metafieldNamespaces,
  metafieldKeys,
} from '../constants/metafield';

const bcrypt = require('bcrypt');

const {
  User,
  Role,
  Brand,
  Permission,
  UserRole,
  UserPermission,
  PersonalAccessToken,
  Metafield,
} = model;

export default {
  async users(req, res) {
    try {
      const users = await User.scope('clean').findAll({
        where: {
          status: 'active',
        },
        include: [
          {
            model: Role,
            as: 'roles',
            through: {
              attributes: [],
            },
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: {
                  attributes: [],
                },
              },
            ],
          },
          {
            model: Brand,
            as: 'brands',
            attributes: ['id', 'name'],
            through: {
              attributes: [],
            },
          },
          {
            model: Metafield,
            as: 'metafield',
            attributes: ['id', 'namespace', 'key', 'value', 'type'],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        200,
        {
          users: users.map((user) => ({
            ...user.get(),
            roles: user.roles.map(({ name, id }) => ({ name, id })),
            permissions: user.roles.reduce(
              (t, c) => [...t, ...c.permissions],
              []
            ),
          })),
        },
        'All registered users'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
  async user(req, res) {
    try {
      const { id } = req.params;
      const user = await User.scope('clean').findByPk(id, {
        include: [
          {
            model: Role,
            as: 'roles',
            through: {
              attributes: [],
            },
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: {
                  attributes: [],
                },
              },
            ],
          },
          {
            model: Brand,
            as: 'brands',
            through: {
              attributes: [],
            },
          },
          {
            model: Metafield,
            as: 'metafield',
            attributes: ['id', 'namespace', 'key', 'value', 'type'],
          },
        ],
      });
      if (user) {
        return sendSuccessResponse(
          res,
          200,
          {
            user: {
              ...user.get(),
              roles: user.roles.map((role) => role.name),
              permissions: user.roles.reduce(
                (t, c) => [...t, ...c.permissions],
                []
              ),
            },
          },
          'User with id'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async usersFiltered(req, res) {
    try {
      const { permissions, brand, chanel } = req.body;
      let where = {};
      const include = [],
        query = {
          include,
        };
      if (permissions && permissions.length) {
        include.push({
          model: Role,
          as: 'roles',
          through: {
            attributes: [],
          },
          required: true,
          include: [
            {
              as: 'permissions',
              model: Permission,
              required: true,
              through: {
                attributes: [],
              },
            },
          ],
        });
        where['$roles.permissions.name$'] = { [Op.in]: permissions };
      }
      if (brand && brand.length) {
        include.push({
          model: Brand,
          as: 'brands',
          through: {
            attributes: [],
          },
        });
        where['$brands.id$'] = { [Op.in]: brand };
      }
      if (Object.keys(where).length) {
        query['where'] = where;
      }
      console.log(query, 'filtered user query', JSON.stringify(query));
      const users = await User.scope('clean').findAll(query);
      if (users && users.length) {
        return sendSuccessResponse(
          res,
          200,
          {
            users,
          },
          'Filtered users'
        );
      }
      return sendErrorResponse(res, 404, 'No data found!');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async create(req, res) {
    const { name, email, password, phone, roles, brands, storeAccess, stores } =
      req.body;
    try {
      let user = await User.findOne({
        where: { [Op.or]: [{ email }, { phone }] },
      });
      if (user) {
        return sendErrorResponse(
          res,
          422,
          'User with email or phone already exists.'
        );
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name,
        phone,
      });
      await user.addRoles(roles);
      if (brands.length) {
        await user.addBrands(brands);
      }

      const assignedRoles = await user.getRoles();
      const assignedBrands = brands.length ? await user.getBrands() : [];

      const rolesWithPermissions = await Promise.all(
        assignedRoles.map((role) => role.getPermissions())
      );
      const permissions = [];
      rolesWithPermissions.forEach((rolePermissions) => {
        rolePermissions.forEach((permission) =>
          permissions.push({ id: permission.id, name: permission.name })
        );
      });
      await user.addPermissions(permissions.map((permission) => permission.id));
      if (storeAccess) {
        await user.update({ settings: { store_access: true } });
        await _metafieldService.bulkCreateInteger(
          stores.map((st) => ({
            namespace: metafieldNamespaces.storeAccess,
            key: metafieldKeys.storeId,
            value: st,
            owner_id: user.id,
            owner_type: metafieldOwners.user,
          }))
        );
      }
      return sendSuccessResponse(
        res,
        201,
        {
          user: {
            email: user.email,
            id: user.id,
            name: user.name,
            phone: user.phone,
            status: user.status,
            settings: user.settings,
            stores: await user.getMetafield({
              where: {
                namespace: metafieldNamespaces.storeAccess,
                key: metafieldKeys.storeId,
              },
            }),
            roles: assignedRoles.map((role) => role.name),
            permissions: permissions.map((permission) => permission.name),
            brands: assignedBrands.map((brand) => ({
              id: brand.id,
              name: brand.name,
            })),
          },
        },
        'Account created successfully'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const userUpdatedData = req.body;
      const {
        name,
        email,
        phone,
        password,
        roles,
        brands,
        status,
        storeAccess,
        stores,
      } = userUpdatedData || {};
      if (email && phone) {
        const userWithEmailOrPhone = await User.findOne({
          where: { [Op.or]: [{ email }, { phone }] },
        });
        if (userWithEmailOrPhone && userWithEmailOrPhone.id !== id) {
          return sendErrorResponse(
            res,
            409,
            'Email or phone number already registered!'
          );
        }
      }
      const user = await User.findByPk(id);
      if (user) {
        // const hashedPassword = await bcrypt.hash(password, 10);
        user.set({
          email: email || user.email,
          name: name || user.name,
          phone: phone || user.phone,
          status: status || user.status,
          password: password ? await bcrypt.hash(password, 10) : user.password,
          updatedAt: new Date().toISOString(),
        });
        if (storeAccess) {
          user.set({ settings: { ...user.settings, store_access: true } });
          await _metafieldService.deleteAll({
            namespace: metafieldNamespaces.storeAccess,
            key: metafieldKeys.storeId,
            owner_id: user.id,
            owner_type: metafieldOwners.user,
          });
          await _metafieldService.bulkCreateInteger(
            stores.map((st) => ({
              namespace: metafieldNamespaces.storeAccess,
              key: metafieldKeys.storeId,
              value: st,
              owner_id: user.id,
              owner_type: metafieldOwners.user,
            }))
          );
        } else {
          user.set({ settings: { ...user.settings, store_access: false } });
          await _metafieldService.deleteAll({
            namespace: metafieldNamespaces.storeAccess,
            key: metafieldKeys.storeId,
            owner_id: user.id,
            owner_type: metafieldOwners.user,
          });
        }
        let assignedRoles, permissions;
        if (roles && roles.length) {
          const currentRoles = await user.getRoles();
          const currentPermissions = await user.getPermissions();
          await user.removeRoles(currentRoles.map((r) => r.id));
          await user.addRoles(roles);
          assignedRoles = await user.getRoles();

          const rolesWithPermissions = await Promise.all(
            assignedRoles.map((role) => role.getPermissions())
          );
          permissions = [];
          rolesWithPermissions.forEach((rolePermissions) => {
            rolePermissions.forEach((permission) =>
              permissions.push({ id: permission.id, name: permission.name })
            );
          });
          await user.removePermissions(
            currentPermissions.map((permission) => permission.id)
          );
          await user.addPermissions(
            permissions.map((permission) => permission.id)
          );
        }
        if (brands && brands.length) {
          await user.setBrands([]);
          await user.addBrands(brands);
        } else if (!brands.length) {
          await user.setBrands([]);
        }
        await user.save();
        return sendSuccessResponse(
          res,
          200,
          {
            user: {
              email: user.email,
              id: user.id,
              name: user.name,
              phone: user.phone,
              status: user.status,
              settings: user.settings,
              stores: await user.getMetafield({
                where: {
                  namespace: metafieldNamespaces.storeAccess,
                  key: metafieldKeys.storeId,
                },
              }),
              brands: await user.getBrands({
                attributes: ['id', 'name'],
                joinTableAttributes: [],
              }),
              roles: assignedRoles?.length
                ? assignedRoles.map((r) => r.name)
                : [],
              permissions: permissions?.length
                ? permissions.map((p) => p.name)
                : [],
            },
          },
          'Operation successful.'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async setDefaultBrand(req, res) {
    try {
      const brandId = req.params.id;
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        include: {
          model: Brand,
          as: 'brands',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
          },
        },
      });
      if (user) {
        const brandIds = user.brands.map((brand) => brand.id);
        if (brandIds.includes(brandId)) {
          await user.update({
            settings: { ...user.settings, default_brand_id: brandId },
          });
          return sendSuccessResponse(
            res,
            200,
            {
              settings: user.settings,
            },
            'Operation successful.'
          );
        } else {
          return sendErrorResponse(
            res,
            403,
            {},
            "You don't have permission to this brand."
          );
        }
      }
      return sendErrorResponse(res, 404, {}, 'User not found!');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async disable(req, res) {
    try {
      const id = req.params.id;
      if (id === req.user.id) {
        return sendErrorResponse(
          res,
          400,
          'Logged in user could not delete himself!'
        );
      }
      const user = await User.findByPk(id);
      if (user) {
        await user.update({ status: 'inactive' });
        return sendSuccessResponse(res, 200, {}, 'Operation successful.');
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      if (id === req.user.id) {
        return sendErrorResponse(
          res,
          400,
          'Logged in user could not delete himself!'
        );
      }
      const user = await User.findByPk(id);
      if (user) {
        await PersonalAccessToken.destroy({
          where: { user_id: user.id },
        });
        await UserRole.destroy({
          where: { user_id: user.id },
        });
        await UserPermission.destroy({
          where: { user_id: user.id },
        });
        await user.setBrands([]);
        await user.destroy();
        return sendSuccessResponse(res, 200, {}, 'Operation successful.');
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
};
