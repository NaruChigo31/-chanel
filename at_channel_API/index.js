const express = require('express')
const cors = require('cors');
const path = require("path")

const userRoute = require('./routes/user.js')
const boardRoute = require('./routes/board.js')
const threadRoute = require('./routes/thread.js')


const app = express()
const port = 3000

app.use('/user', userRoute)
app.use('/board', boardRoute)
app.use('/thread', threadRoute)


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