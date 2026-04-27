const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes (ONLY WORK IF ROUTES EXPORT CORRECTLY)
app.use("/users", require("./routes/users"));
app.use("/vehicles", require("./routes/vehicles"));
app.use("/permits", require("./routes/permits"));
app.use("/citations", require("./routes/citations"));
app.use("/disputes", require("./routes/disputes"));
app.use("/officer", require("./routes/officer"));
app.use("/transactions", require("./routes/transactions"));
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
