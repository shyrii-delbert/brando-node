import express from 'express';
import { init as initDB } from '$db';
import { registerRoutes } from '$routes';

initDB().then(() => {
  const app = express();
  const port = 9000;

  registerRoutes(app);
  
  app.listen(port, () => {
    console.log(`Brando is listening at http://localhost:${port}`);
  });
}).catch(e => {
  console.log(e);
  process.exit(1);
});
