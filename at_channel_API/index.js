const express = require('express')
const cors = require('cors');
const { Users, Admins } = require("./db.js")

const usersRoute = require('./routes/users.js')
const boardsRoute = require('./routes/boards.js')
const postsRoute = require('./routes/posts.js')


const app = express()
const port = 3000

app.use('/user', usersRoute)
app.use('/board', boardsRoute)
app.use('/posts', postsRoute)



// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// router.use(express.static('public'))

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

// module.exports = isAdminCheck

// export {isAdminCheck}