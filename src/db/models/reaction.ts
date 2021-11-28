import { DataTypes, Model } from 'sequelize';
import { sequelize } from '$db/connection';
import { Photo } from './photo';

export class Reaction extends Model { }

Reaction.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  is_post: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  type: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'reactions',
  indexes: [{ unique: true, fields: ['id'] }],
});

Photo.hasMany(Reaction, {
  foreignKey: 'photo_id',
});
Reaction.belongsTo(Photo);
