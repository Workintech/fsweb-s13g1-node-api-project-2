// require your server and launch it here
const server = require("./api/server");
require("dotenv").config();

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
