import * as Knex from 'knex';
import {
  Config,
  createConfig,
  deleteConfigs,
  getAllConfigs,
  getConfig,
  updateConfigs,
} from './configs';
import { getDb, stopDb } from './db';

describe('Config Service Tests', () => {
  let db: Knex;

  beforeEach(async () => {
    db = getDb();
    await db('configurations').truncate();
  });

  afterEach(async () => {
    await stopDb();
  });

  describe('empty database', () => {
    it('get not defined config should return undefined', async () => {
      const res = await getConfig('not-defined');
      expect(res).toBeUndefined();
    });

    describe('create config', () => {
      let res: Config;
      const expected: Config = {
        id: 'new-config',
        value: 'test',
        name: 'test',
      };

      beforeEach(async () => {
        res = await createConfig('new-config', 'test', 'test');
      });

      it('res should equal the expected config', () => {
        expect(res).toEqual(expected);
      });

      it('on db should exist the created config', async () => {
        const dbConfig = await getConfig('new-config');
        expect(dbConfig).toEqual(expected);
      });
    });

    it('delete not defined config should throw error', () => {
      expect(deleteConfigs('not-defined')).rejects.toEqual(
        new Error('Config not-defined does not exist')
      );
    });

    it('update not defined config should throw error', () => {
      expect(updateConfigs('not-defined', 'test', 'test')).rejects.toEqual(
        new Error('Config not-defined does not exist')
      );
    });

    it('get all configs with empty db should return empty list', async () => {
      const res = await getAllConfigs();
      expect(res).toStrictEqual([]);
    });
  });

  describe('database with 2 configs', () => {
    const config1: Config = {
      id: 'config1',
      value: 'config-1',
      name: 'Config 1',
    };
    const config2: Config = {
      id: 'config2',
      value: 'config-2',
      name: 'Config 2',
    };

    beforeEach(async () => {
      await db<Config>('configurations').insert([config1, config2]);
    });

    it('get should return configuration', async () => {
      const res = await getConfig(config1.id);
      expect(res).toEqual(config1);
    });

    it('get all configs db should return list with 2 values', async () => {
      const res = await getAllConfigs();
      expect(res.length).toBe(2);
    });

    it('create a config with existing id should throw', async () => {
      expect(createConfig(config1.id, 'test', 'test')).rejects.toEqual(
        new Error('Config config1 already exists')
      );
    });

    describe('delete config', () => {
      const toDelete = config1;
      let res: Config;
      beforeEach(async () => {
        res = await deleteConfigs(toDelete.id);
      });

      it('res should equal the deleted config', () => {
        expect(res).toEqual(toDelete);
      });

      it('on db should not exists the delete config', async () => {
        const dbConfig = await getConfig(toDelete.id);
        expect(dbConfig).toBeUndefined();
      });
    });

    describe('update config', () => {
      const toUpdate = config1;
      const expected: Config = {
        id: toUpdate.id,
        value: 'updated-value',
        name: 'updated name',
      };
      let res: Config;
      beforeEach(async () => {
        res = await updateConfigs(toUpdate.id, 'updated name', 'updated-value');
      });

      it('res should equal the updated config', () => {
        expect(res).toEqual(expected);
      });

      it('config should be updated on db', async () => {
        const dbConfig = await getConfig(toUpdate.id);
        expect(dbConfig).toEqual(expected);
      });
    });
  });
});
