import { Sequelize, DataTypes, Model, Deferrable } from 'sequelize';
import { sequelize } from '$db/connection';

export class Album extends Model { }

Album.init({
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
}, {
  sequelize,
  tableName: 'albums',
  indexes: [{ unique: true, fields: ['id'] }],
});
