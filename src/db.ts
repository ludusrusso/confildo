import * as Knex from 'knex';
import { getConfigs } from 'env-ts-conf';

let db: Knex | undefined;

function getDbConfig() {
  return getConfigs({
    database: {
      type: 'string',
      variableName: 'DB_NAME',
      default: 'postgres',
    },
    user: {
      type: 'string',
      variableName: 'DB_USER',
      default: 'postgres',
    },
    password: {
      type: 'string',
      variableName: 'DB_PASSWORD',
      default: 'postgres',
    },
    host: {
      type: 'string',
      variableName: 'DB_HOST',
      default: 'localhost',
    },
    port: {
      type: 'number',
      variableName: 'DB_PORT',
      default: 5432,
    },
  });
}

export function createConnection(config?: any): Knex {
  const dbConf = config || getDbConfig();
  return Knex({
    client: 'pg',
    connection: {
      database: dbConf.database,
      user: dbConf.user,
      password: dbConf.password,
      host: dbConf.host,
      port: dbConf.port,
    },
  });
}

export function getDb() {
  if (!db) {
    db = createConnection();
  }
  return db;
}

export async function stopDb() {
  if (db) {
    await db.destroy();
  }
  db = undefined;
}
