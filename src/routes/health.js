const db = require("../db");

async function healthCheck(req, res, next) {
  try {
    const dbQuery = await db.raw('SELECT 1+1 as result');
    const health = {
      API: diagnose(true),
      database: diagnose(dbQuery && dbQuery.rows && dbQuery.rows[0].result === 2),
    }
    const isHealthy = (Object.values(health)).every(val => val === diagnose(true));
    const isSick = (Object.values(health)).some(val => val === diagnose(true));
    const message = (isHealthy)
      ? 'The world will not burn today.'
      : (isSick)
        ? 'The fire department has been called.'
        : 'The world is on fire.'
    const response = { 
      owner: 'Tec3, LLC',
      ok: true,
      message,
      ...health
    };

    return res.json(response);
  } catch (error) {
    return next(error);
  }
}

function diagnose(bool) {
  return (bool) ? 'healthy' : 'sick';
}

module.exports = healthCheck;

