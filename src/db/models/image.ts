import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { Photo } from './photo';
import { ImageModel } from '$typings/images';
import { generateCDNUrl } from '$utils';
import { serializeImagePaths } from '$routes/api/v1/images/serializers';

export class Image extends Model<ImageModel> {}

Image.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    sha256: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    proxied: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    exif: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    objectPath: {
      type: DataTypes.STRING,
      field: 'object_path',
      allowNull: false,
    },
    livePhoto: {
      type: DataTypes.JSON,
      field: 'live_photo',
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'images',
    indexes: [{ unique: true, fields: ['id'] }],
  }
);

Photo.hasOne(Image, {
  foreignKey: 'image_id',
  as: 'image',
});
Image.belongsTo(Photo, { as: 'photo' });

export function processImageObj(image: ImageModel): ImageModel {
  return serializeImagePaths(image, generateCDNUrl);
}
