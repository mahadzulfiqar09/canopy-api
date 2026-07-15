require("dotenv").config();
const createApp = require("./app");

const PORT = process.env.PORT || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Canopy API listening on http://localhost:${PORT}`);
  console.log(`Health check:        http://localhost:${PORT}/api/health`);
  console.log(`Tasks endpoint:      http://localhost:${PORT}/api/tasks`);
});
