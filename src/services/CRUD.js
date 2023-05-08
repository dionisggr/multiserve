const db = require('../db');

class CRUD {
  constructor(app_id) {
    this.app_id = app_id;
  }

  async create({ data, returning = ['*'] }) {
    return (await db(this.table)
      .insert(data)
      .returning(returning))[0];
  }

  async get(adjustments) {
    const {
      filters = true,
      multiple = false,
      columns = ['*'],
      leftJoin,
      leftJoins,
      rightJoin,
      rightJoins,
      innerJoin,
      innerJoins,
      whereRaw,
      whereIn,
      where,
      andWhereNotExists,
      groupBy,
      orderBy,
    } = adjustments || {};

    let response = db(this.table).select(...columns);

    if (leftJoin || leftJoins) {
      for (let join of leftJoins || [leftJoin]) {
        response = response.leftJoin(...join);
      }
    }

    if (rightJoin || rightJoins) {
      for (let join of rightJoins || [rightJoin]) {
        response = response.rightJoin(...join);
      }
    }

    if (innerJoin || innerJoins) {
      for (let join of innerJoins || [innerJoin]) {
        response = response.innerJoin(...join);
      }
    }

    if (filters) response = response.where(filters);
    if (where) response = response.where(...where)
    if (whereRaw) response = response.whereRaw(...whereRaw);
    if (whereIn) response = response.whereIn(...whereIn);
    if (andWhereNotExists) response = response.andWhereNotExists(...andWhereNotExists);
    if (groupBy) response = response.groupBy(...groupBy);
    if (orderBy) response = response.orderBy(...orderBy);

    response = await response;

    if (!multiple) response = response[0];

    return response;
  }

  async update(adjustments) {
    const {
      data,
      filters = true,
      multiple = false,
      where,
      andWhere,
      returning = ['*'],
      leftJoin,
      rightJoin,
      innerJoin,
    } = adjustments || {};

    let response = db(this.table).update(data);

    if (leftJoin) response = response.leftJoin(...leftJoin);
    if (rightJoin) response = response.rightJoin(...rightJoin);
    if (innerJoin) response = response.innerJoin(...innerJoin);
    if (filters) response = response.where(filters)
    if (where) response = response.where(...where)
    if (andWhere) response = response.andWhere(...andWhere);
    if (returning) response = response.returning(returning)

    response = response.then(rows => rows);
    response = (multiple)
      ? await response.then(rows => rows)
      : await response.then(rows => rows[0]);
    
    return response;
  }

  async remove({ filters }) {
    if (!filters) throw new Error('Missing filters to delete.');
    
    return await db(this.table)
      .where(filters)
      .delete();
  }
}

module.exports = CRUD;
