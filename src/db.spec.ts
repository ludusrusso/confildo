import * as Knex from 'knex';
import { getDb, stopDb } from './db';

describe('test database', () => {
  let db: Knex;

  beforeEach(() => {
    db = getDb();
  });

  afterEach(async () => {
    await stopDb();
  });

  it('test connection', async () => {
    const res = await db.raw('select 1');
    expect(res).toBeTruthy();
  });
});
