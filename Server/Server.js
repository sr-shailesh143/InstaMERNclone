const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
app.use(express.json())

require("./config/db");

app.use(cors());

app.use(require("./routes/user"))


const postRoutes = require("./routes/post.route")
app.use("/api", postRoutes)

const uaerRoutes = require("./routes/user.route")
app.use("/api", uaerRoutes)

const reelsRoutes = require("./routes/reels.routes")
app.use("/api", reelsRoutes)

const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}! 👍`))