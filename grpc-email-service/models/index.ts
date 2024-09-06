import database from "../db/sequelize";
import userModel from "./userModel";
const models = [
  userModel,
];
models.forEach((model) => {
  model.initialize(database);
});
 
export = {
  database,
  userModel,
   
};
