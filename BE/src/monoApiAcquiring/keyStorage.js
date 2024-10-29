import sqlite3 from 'sqlite3';

class KeyStorage {
  constructor() {
    this.storagePath = './storage.db';

    // Ініціалізація бази даних SQLite
    this.db = new sqlite3.Database(this.storagePath);
    this.db.run(
      'CREATE TABLE IF NOT EXISTS keys (token TEXT PRIMARY KEY, publicKey TEXT)',
    );
  }

  // Збереження публічного ключа для вказаного токена
  async savePublicKey(token, publicKey) {
    const stmt = this.db.prepare('INSERT OR REPLACE INTO keys VALUES (?, ?)');
    stmt.run(token, publicKey);
    stmt.finalize();
  }

  // Отримання публічного ключа для вказаного токена
  async getPublicKey(token) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT publicKey FROM keys WHERE token = ?',
        [token],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row ? row.publicKey : null);
          }
        },
      );
    });
  }
}

export default KeyStorage;
