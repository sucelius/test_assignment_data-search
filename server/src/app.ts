import express, { Application } from "express";

import cors from "cors";

import { delayMiddleware } from "./middlewares/delayMiddleware";

//Rout exports
import findRouter from "./routes/findRouter";

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//custom middlewares
app.use(delayMiddleware);

app.use(findRouter);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
