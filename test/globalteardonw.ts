import { stopDb } from '../src/db';

export default async function () {
  await (global as any).__DOCKER_COMPOSE_ENV__.down();
  process.env = (global as any).__DEFAULTENV__;
}
