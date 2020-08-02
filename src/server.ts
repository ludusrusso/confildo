import * as express from 'express';
import {
  getConfig,
  getAllConfigs,
  createConfig,
  Config,
  deleteConfigs,
  updateConfigs,
} from './configs';

const app = express();
app.use(express.json());

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const config = await getConfig(id);
  if (!config) {
    res.status(404).send({ message: 'not found' });
    return;
  }
  res.send(config);
});

app.get('/', async (req, res) => {
  const configs = await getAllConfigs();
  res.send(configs);
});

app.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, value } = req.body;
  try {
    const config = await createConfig(id, name, value);
    res.status(201).send(config);
  } catch {
    res.status(409).send({ error: `${id} already exists` });
  }
});

app.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, value } = req.body;
  try {
    const config = await updateConfigs(id, name, value);
    res.status(200).send(config);
  } catch {
    res.status(404).send({ error: `not found` });
  }
});

app.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const config = await deleteConfigs(id);
    res.status(200).send(config);
  } catch {
    res.status(404).send({ error: `not found` });
  }
});

export { app };
