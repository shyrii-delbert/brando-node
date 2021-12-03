import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { Photo } from './photo';
import { ImageModel } from '$typings/images';

export class Image extends Model<ImageModel> { }

Image.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  objectPath: {
    type: DataTypes.STRING,
    field: 'object_path',
    allowNull: false,
  },
  uploaded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: 'images',
  indexes: [{ unique: true, fields: ['id'] }],
});

Photo.hasOne(Image, {
  foreignKey: 'image_id',
});
Image.belongsTo(Photo);
