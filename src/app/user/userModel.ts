import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import sequelize from '../../database/pgsql';

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

class UserModel extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public email!: string;
    public password!: string;
    public createdAt?: Date;
    public updatedAt?: Date;

    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    }
);

UserModel.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

export default UserModel;
