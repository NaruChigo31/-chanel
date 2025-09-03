const express = require('express')
const cors = require('cors');
const path = require("path")

const usersRoute = require('./routes/users.js')
const boardsRoute = require('./routes/boards.js')
const postsRoute = require('./routes/posts.js')


const app = express()
const port = 3000

app.use('/users', usersRoute)
app.use('/boards', boardsRoute)
app.use('/posts', postsRoute)


app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname,"index.html"))
})
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// router.use(express.static('public'))
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

// module.exports = isAdminCheck

// export {isAdminCheck}