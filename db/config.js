const sql = require("mssql");

const config = {
  server: "localhost", // Use localhost or localhost\\MSSQLSERVER01
  database: "RivertonParking",
  options: {
    trustServerCertificate: true,
  },
  user: "appUser",
  password: "1234",
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to MSSQL Database natively!");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed! Bad Config: ", err);
  });

module.exports = {
  sql,
  poolPromise,
};
