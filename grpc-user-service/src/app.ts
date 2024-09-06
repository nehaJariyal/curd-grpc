import express from "express";
import bodyParser from "body-parser";

const app: any = express();
const port: number = 4000;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(` The server running on port: ${port}`);
});