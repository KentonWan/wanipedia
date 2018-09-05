'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborators = sequelize.define('Collaborators', {
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Wikis",
        key: "id",
        as: "wikiId"
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId"
      }
    },
  }, {});
  Collaborators.associate = function(models) {
    Collaborators.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
    Collaborators.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    // associations can be defined here
  };
  return Collaborators;
};