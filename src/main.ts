import { getConfigs } from 'env-ts-conf';
import { app } from './server';

const serverConfig = getConfigs({
  port: {
    type: 'number',
    variableName: 'PORT',
    default: 3000,
  },
});

export function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

startServer(serverConfig.port);
