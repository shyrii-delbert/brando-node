import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { Photo } from './photo';

export class Image extends Model { }

Image.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  object_key: {
    type: DataTypes.UUID,
    allowNull: true,
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
