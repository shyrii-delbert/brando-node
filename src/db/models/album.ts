import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { AlbumModel } from '$typings/albums';

export class Album extends Model<AlbumModel> {}

Album.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    mainArea: {
      type: DataTypes.STRING,
      defaultValue: '',
      field: 'main_area',
    },
    subArea: {
      type: DataTypes.STRING,
      defaultValue: '',
      field: 'sub_area',
    },
  },
  {
    sequelize,
    tableName: 'albums',
    indexes: [{ unique: true, fields: ['id'] }],
  }
);
