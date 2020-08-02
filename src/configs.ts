import { getDb } from './db';

export interface Config {
  id: string;
  name: string;
  value: string;
}

const getConfigService = () => getDb()<Config>('configurations');

export async function getConfig(id: string): Promise<Config | undefined> {
  const configService = getConfigService();
  const res = await configService.select('*').where('id', '=', id).first();
  return res;
}

export async function getAllConfigs(): Promise<Config[]> {
  const configService = getConfigService();
  return await configService.select('*');
}

export async function createConfig(
  id: string,
  name: string,
  value: string
): Promise<Config> {
  const existingConfig = await getConfig(id);

  if (existingConfig) {
    throw new Error(`Config ${id} already exists`);
  }

  const configService = getConfigService();
  const created = await configService
    .insert({
      id,
      name,
      value,
    })
    .returning('*');
  return created[0];
}

export async function updateConfigs(
  id: string,
  name: string,
  value: string
): Promise<Config> {
  const config = await getConfig(id);

  if (!config) {
    throw new Error(`Config ${id} does not exist`);
  }

  const configService = getConfigService();
  const updated = await configService
    .update({
      name,
      value,
    })
    .where('id', '=', id)
    .returning('*');
  return updated[0];
}

export async function deleteConfigs(id: string): Promise<Config> {
  const config = await getConfig(id);

  if (!config) {
    throw new Error(`Config ${id} does not exist`);
  }

  const configService = getConfigService();
  const deleted = await configService
    .delete()
    .where('id', '=', id)
    .returning('*');

  return deleted[0];
}
