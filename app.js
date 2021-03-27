const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const globalFunction = require("./utils/util-function");

//parser
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN, //block all except this domain
    credentials: true, //turn on cookie http through cors
  })
);

// require("./middlewares/schedule-task.mdw")(app); //mdw to do anything scheduled automatically without client's req

require("./middlewares/routes.mdw")(app); //mdw for routing
require("./middlewares/errors.mdw")(app); //mdw for err handling

//lang nghe o cong
const PORT = process.env.LISTENPORT;
app.listen(PORT, () => {
  //console.log(`Example app listening at http://localhost:${PORT}`);
});
