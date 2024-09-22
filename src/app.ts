import './env';
import './requireHack';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { init as initDB } from '$db';
import { registerRoutes } from '$routes';
import { errorHandler } from '$middlewares/error-handler';
import { brandoLogger } from '$logger';
import { expressLogMiddleware } from '$middlewares/log';
import { originList } from '$consts/cors';
import { auth } from '$middlewares/auth';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');

initDB()
  .then(() => {
    const app = express();
    const port = 8088;

    app.use(
      cors({
        origin: originList,
        credentials: true,
      })
    );
    app.use(expressLogMiddleware);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(auth);
    registerRoutes(app);
    app.use(errorHandler);

    app.listen(port, () => {
      brandoLogger.info(`Brando is listening at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    brandoLogger.fatal(JSON.stringify(e));
    process.exit(1);
  });
