import './env';
import './requireHack';

import express from 'express';
import bodyParser from 'body-parser';
import { init as initDB } from '$db';
import { registerRoutes } from '$routes';
import { errorHandler } from '$middlewares/error-handler';

initDB().then(() => {
  const app = express();
  const port = 9000;

  app.use(bodyParser.json());
  registerRoutes(app);
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Brando is listening at http://localhost:${port}`);
  });
}).catch(e => {
  console.log(e);
  process.exit(1);
});
