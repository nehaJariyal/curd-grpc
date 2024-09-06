import bcrypt from "bcrypt";
import { DataTypes, Model, Sequelize } from "sequelize";
import { TABLES } from "../constant/common";

class User extends Model {
  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
      
        to: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        text: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: TABLES.EMAIL,
        timestamps: false,
        hooks: {
          beforeValidate: (user: any, options) => {
            if (user.changed("password")) {
              const salt = bcrypt.genSaltSync();
              const hashedPassword = bcrypt.hashSync(user.password, salt);
              user.password = hashedPassword;
            }
          },
          beforeUpdate: (user: any, options) => {
            if (user.changed("password")) {
              const salt = bcrypt.genSaltSync();
              const hashedPassword = bcrypt.hashSync(user.password, salt);
              user.password = hashedPassword;
            }
          },
        },
      }
    );
  }
}

export default User;
