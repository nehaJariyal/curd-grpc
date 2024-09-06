import { DataTypes, Model, Sequelize } from "sequelize";
import { TABLES } from "../constant/common";

class User extends Model {
  username: any;
  password: any;
  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: TABLES.USERS,
        timestamps: false,
        
      }
    );
  }
}

export default User;
