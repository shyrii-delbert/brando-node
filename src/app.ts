import './env';
import './requireHack';

import express from 'express';
import bodyParser from 'body-parser';
import { init as initDB } from '$db';
import { registerRoutes } from '$routes';
import { errorHandler } from '$middlewares/error-handler';
import { brandoLogger } from '$logger';
import { expressLogMiddleware } from '$middlewares/log';

initDB().then(() => {
  const app = express();
  const port = 9000;

  // app.use(expressLogMiddleware);
  app.use(bodyParser.json());
  registerRoutes(app);
  app.use(errorHandler);

  app.listen(port, () => {
    brandoLogger.info(`Brando is listening at http://localhost:${port}`);
  });
}).catch(e => {
  brandoLogger.fatal(JSON.stringify(e));
  process.exit(1);
});
