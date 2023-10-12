import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class MOVIE extends Model {
  public movieName!: number;
  public duration!: string;
  public rating!: string;
}

MOVIE.init(
  {
    movieName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      primaryKey: true,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: false,
    },
  },
  {
    tableName: 'movie_list',
    sequelize,
    timestamps: false
  }
);

export default MOVIE;
