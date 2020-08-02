import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';

const composeFilePath = path.resolve(__dirname);
const composeFile = 'docker-compose.yaml';

const createPostgreDb = async () => {
  const environment = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  ).up();

  return environment;
};

export default async function () {
  const dockerComposeEnv = await createPostgreDb();
  (global as any).__DOCKER_COMPOSE_ENV__ = dockerComposeEnv;
  (global as any).__DEFAULTENV__ = process.env;
  process.env.DB_PORT = String(
    dockerComposeEnv.getContainer('test_db_1').getMappedPort(5432)
  );
}
