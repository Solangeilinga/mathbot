// db/connection.js — MySQL avec API compatible (query, queryOne, all, get, run)
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bepcmath',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}

// Exécute une requête SQL avec paramètres, retourne toutes les lignes (SELECT multiple)
async function query(sql, params = []) {
  try {
    const poolInstance = await getPool();
    const [rows] = await poolInstance.execute(sql, params);
    return rows;
  } catch (err) {
    console.error('❌ Erreur SQL (query):', err.message);
    throw err;
  }
}

// Exécute une requête SQL, retourne la première ligne (ou undefined)
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0];
}

// Alias pour query (compatibilité SQLite)
async function all(sql, params = []) {
  return query(sql, params);
}

// Alias pour queryOne (compatibilité)
async function get(sql, params = []) {
  return queryOne(sql, params);
}

// Exécute une requête d'écriture (INSERT, UPDATE, DELETE)
async function run(sql, params = []) {
  try {
    const poolInstance = await getPool();
    const [result] = await poolInstance.execute(sql, params);
    return { changes: result.affectedRows, lastID: result.insertId };
  } catch (err) {
    console.error('❌ Erreur SQL (run):', err.message);
    throw err;
  }
}

// API de compatibilité avec l'ancien code SQLite (getDB())
function getDB() {
  return {
    prepare: (sql) => ({
      all: (...args) => {
        let params = args;
        if (args.length === 1 && Array.isArray(args[0])) params = args[0];
        return query(sql, params);
      },
      get: (...args) => {
        let params = args;
        if (args.length === 1 && Array.isArray(args[0])) params = args[0];
        return queryOne(sql, params);
      },
      run: (...args) => {
        let params = args;
        if (args.length === 1 && Array.isArray(args[0])) params = args[0];
        return run(sql, params);
      },
    }),
    exec: async (sql) => {
      const poolInstance = await getPool();
      await poolInstance.query(sql);
    },
  };
}

async function initDB() {
  await getPool();
  console.log('✅ Pool MySQL prêt (API compatible)');
}

module.exports = { getPool, query, queryOne, all, get, run, getDB, initDB };