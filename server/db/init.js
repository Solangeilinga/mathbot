// db/init.js — Création des tables MySQL (version robuste)
require("dotenv").config();
const { query, getPool } = require("./connection");

async function columnExists(tableName, columnName) {
  const pool = await getPool();
  const [rows] = await pool.execute(`
    SELECT COUNT(*) AS count 
    FROM information_schema.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = ? 
      AND COLUMN_NAME = ?
  `, [tableName, columnName]);
  return rows[0].count > 0;
}

async function init() {
  console.log("🔧 Initialisation de la base MySQL...");

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id                  VARCHAR(36)  PRIMARY KEY,
      nom                 VARCHAR(100) NOT NULL,
      prenom              VARCHAR(100) NOT NULL,
      email               VARCHAR(255) UNIQUE NOT NULL,
      password            VARCHAR(255) NOT NULL,
      xp                  INT          DEFAULT 0,
      niveau              INT          DEFAULT 1,
      profil_pedagogique  TEXT         DEFAULT NULL,
      profil_updated_at   DATETIME     DEFAULT NULL,
      created_at          DATETIME     DEFAULT CURRENT_TIMESTAMP,
      updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS progression (
      id         VARCHAR(36)  PRIMARY KEY,
      user_id    VARCHAR(36)  NOT NULL,
      chapitre   VARCHAR(100) NOT NULL,
      score      INT          DEFAULT 0,
      sessions   INT          DEFAULT 0,
      exercices  INT          DEFAULT 0,
      reussites  INT          DEFAULT 0,
      updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_chapitre (user_id, chapitre)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id         VARCHAR(36)  PRIMARY KEY,
      user_id    VARCHAR(36)  NOT NULL,
      chapitre   VARCHAR(100) NOT NULL,
      xp_gagne   INT          DEFAULT 0,
      duree_sec  INT          DEFAULT 0,
      created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS conversation_history (
      id         INT          AUTO_INCREMENT PRIMARY KEY,
      user_id    VARCHAR(36)  NOT NULL,
      chapitre   VARCHAR(100) NOT NULL,
      role       ENUM('user','assistant') NOT NULL,
      content    TEXT         NOT NULL,
      created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_chapitre (user_id, chapitre)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS exercices_log (
      id         INT          AUTO_INCREMENT PRIMARY KEY,
      user_id    VARCHAR(36)  NOT NULL,
      chapitre   VARCHAR(100) NOT NULL,
      correct    TINYINT(1)   NOT NULL,
      xp_gagne   INT          DEFAULT 0,
      created_at DATETIME     DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id           INT          AUTO_INCREMENT PRIMARY KEY,
      user_id      VARCHAR(36)  NOT NULL,
      chapitre     VARCHAR(100) NOT NULL,
      score        INT          NOT NULL,
      total        INT          NOT NULL,
      percentage   INT          NOT NULL,
      temps_restant INT         DEFAULT 0,
      created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_chapitre (user_id, chapitre)
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS exam_subjects (
      id           INT          AUTO_INCREMENT PRIMARY KEY,
      session      VARCHAR(50)  NOT NULL,
      chapitre     VARCHAR(100) NOT NULL,
      sujet        LONGTEXT     NOT NULL,
      created_at   DATETIME     DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_session_chapitre (session, chapitre)
    )
  `);

  // Migration : ajout des colonnes profil si absentes (vérification explicite)
  const hasProfilCol = await columnExists('users', 'profil_pedagogique');
  if (!hasProfilCol) {
    await query("ALTER TABLE users ADD COLUMN profil_pedagogique TEXT DEFAULT NULL");
    await query("ALTER TABLE users ADD COLUMN profil_updated_at DATETIME DEFAULT NULL");
    console.log("✅ Colonnes profil ajoutées");
  } else {
    console.log("ℹ️  Colonnes profil déjà présentes");
  }

  console.log("✅ Tables MySQL prêtes !");
}

// Si exécuté directement
if (require.main === module) {
  init().then(() => process.exit(0)).catch((err) => {
    console.error("❌ Erreur init MySQL :", err.message);
    process.exit(1);
  });
}

module.exports = { init };