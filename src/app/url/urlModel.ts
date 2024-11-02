import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../database/pgsql';
import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet(process.env.CUSTOM_ALPHABET || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

interface UrlAttributes {
    id: number;
    originalUrl: string;
    shortUrl: string;
    accessCount: number;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    isActive: boolean;
}

interface UrlCreationAttributes extends Optional<UrlAttributes, 'id' | 'shortUrl' | 'accessCount' | 'userId' | 'isActive' | 'deletedAt'> { }

class UrlModel extends Model<UrlAttributes, UrlCreationAttributes> {
    public id!: number;
    public originalUrl!: string;
    public shortUrl?: string;
    public accessCount!: number;
    public userId?: number;
    public createdAt?: Date;
    public updatedAt?: Date;
    public deletedAt?: Date | null;
    public isActive!: boolean;
}

UrlModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        originalUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shortUrl: {
            type: DataTypes.STRING(6),
            allowNull: false,
            unique: true,
            defaultValue: () => nanoid(),
        },
        accessCount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Url',
        timestamps: true,
        paranoid: true,
    }
);

export default UrlModel;
