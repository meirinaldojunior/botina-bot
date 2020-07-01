const {
    Sequelize,
    Op,
    Model,
    DataTypes
} = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite'
});

sequelize.authenticate();
sequelize.sync();

try {
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// models

const TCIdeias = sequelize.define('TCIdeias', {
  uid: {
    type: DataTypes.STRING,
    primaryKey: true
  },
    msg: {
      type: DataTypes.TEXT(),
      allowNull: false
    },
  }, {
    // Other model options go here
  });

module.exports.sequelize = sequelize;
module.exports.TCIdeias = TCIdeias;