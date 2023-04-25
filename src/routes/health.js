const passport = require('../middleware/passport');
const db = require("../db");

async function healthCheck(req, res, next) {
  try {
    const dbQuery = await db.raw('SELECT 1+1 as result');
    const hasStrategies = passport._strategies && Object.keys(passport._strategies).length > 0;
    const hasSerializationFunctions =
      typeof passport.serializeUser === 'function' &&
      typeof passport.deserializeUser === 'function';
    const health = {
      API: diagnose(true),
      auth: diagnose(hasStrategies && hasSerializationFunctions),
      database: diagnose(dbQuery && dbQuery.rows && dbQuery.rows[0].result === 2),
    }
    const isHealthy = (Object.values(health)).every(val => val === diagnose(true));
    const isSick = (Object.values(health)).some(val => val === diagnose(true));
    const message = (isHealthy)
      ? 'The world will not burn today.'
      : (isSick)
        ? 'The world is on fire.'
        : 'The fire department is out controlling flames.'
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

