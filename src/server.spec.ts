import { Config } from './configs';
import { getDb, stopDb } from './db';
import * as supertest from 'supertest';
import { app } from './server';

describe('Server E2E Test', () => {
  let request: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const db = getDb();
    await db('configurations').truncate();
    request = supertest(app);
  });

  afterEach(async () => {
    await stopDb();
  });

  it('Get all configs with empty db should return empty list', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  describe('Create Configuration', () => {
    const config: Config = {
      id: 'test',
      value: 'testvalue',
      name: 'Test Config',
    };

    it('create call should return the created config', async () => {
      const response = await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });
      expect(response.status).toEqual(201);
      expect(response.body).toEqual(config);
    });

    it('create existing config should return error', async () => {
      await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });

      const response = await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });
      expect(response.status).toEqual(409);
      expect(response.body).toEqual({ error: 'test already exists' });
    });
  });

  describe('Get Configuration', () => {
    const config: Config = {
      id: 'test',
      value: 'testvalue',
      name: 'Test Config',
    };

    beforeEach(async () => {
      await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });
    });

    it('Get existing config should return the config data', async () => {
      const response = await request.get(`/${config.id}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(config);
    });

    it('Get all configs should return the config lists', async () => {
      const response = await request.get(`/`);
      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(1);
    });

    it('Get non existing config should return 404', async () => {
      const response = await request.get(`/not-existing`);
      expect(response.status).toEqual(404);
    });
  });

  describe('Update Configuration', () => {
    const config: Config = {
      id: 'test',
      value: 'testvalue',
      name: 'Test Config',
    };

    const updateConfig: Config = {
      id: 'test',
      value: 'updated-testvalue',
      name: 'Updated Test Config',
    };

    beforeEach(async () => {
      await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });
    });

    it('Update existing config should return the updated config data', async () => {
      const response = await request.put(`/${config.id}`).send({
        name: updateConfig.name,
        value: updateConfig.value,
      });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(updateConfig);
    });

    it('Update non existing config should return 404', async () => {
      const response = await request.put(`/non-existing`).send({
        name: updateConfig.name,
        value: updateConfig.value,
      });
      expect(response.status).toEqual(404);
    });
  });

  describe('Delete Configuration', () => {
    const config: Config = {
      id: 'test',
      value: 'testvalue',
      name: 'Test Config',
    };

    beforeEach(async () => {
      await request.post(`/${config.id}`).send({
        name: config.name,
        value: config.value,
      });
    });

    it('Delete existing config should remove the config from server', async () => {
      const response = await request.delete(`/${config.id}`);
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(config);

      const getResponse = await request.get(`/${config.id}`);
      expect(getResponse.status).toEqual(404);
    });

    it('Delete non existing config should return 404', async () => {
      const response = await request.delete(`/non-existing`);
      expect(response.status).toEqual(404);
    });
  });
});
