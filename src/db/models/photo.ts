import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { Album } from './album';

export class Photo extends Model { }

Photo.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  isPost: {
    type: DataTypes.BOOLEAN,
    field: 'is_post',
    defaultValue: false,
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  sequelize,
  tableName: 'photos',
  indexes: [{ unique: true, fields: ['id'] }],
});

Album.hasMany(Photo, {
  foreignKey: 'album_id',
});
Photo.belongsTo(Album);
