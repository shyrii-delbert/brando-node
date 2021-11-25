import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const port = 9000;

app.get('/', (req: any, res: any) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Brando listening at http://localhost:${port}`);
});
