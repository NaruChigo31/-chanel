const express = require('express')
const cors = require('cors');
const { Posts, Boards, Admins, Users } = require("../db.js")
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const publicFolderPath = String(path.join(__dirname, "public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, publicFolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// router

const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());


async function isAdminCheck(apikey, res, cb){
    Users.findOne({
        where:{ apikey: apikey }
    }).then( (you)=>{        
        console.log(you)
        if(!you){
            return res.status(403).json({code:403, error: "There's no such an apikey in database"})
        } 
        Admins.findOne({
            where: {userId: you.dataValues.id}
        }).then((youAdmin)=>{
            if(!youAdmin){
                return res.status(404).json({code:403, error: "You're not admin"})
            }  
            // console.log(youAdmin)
            cb()
        })
    })
}


router.get("/:boardId/:page",async (req, res) => {
    try{
        let boardId = Number(req.params.boardId)

        if(`${boardId}` == "Nan" || !boardId){
            return res.status(400).json({ code:400, error: "yo, what's an id of the board?" })
        }
        let board = await Boards.findOne({
            where:{
                id : boardId
            }
        })
        if(!board){
            return res.status(404).json({ code: 404, error: "Oops, looks like there's no board found" })
        }

        const page = Number(req.params.page)

        if(`${page}` != "Nan" || !page){
            return res.status(400).json({ code:400, error: "yo, what page are u at?" })
        }

        let messagesAmount = 15
        
        let threds = await Messages.findAll({
            where:{
                boardId: boardId
            },
            offset: (page-1)*messagesAmount, 
            limit: messagesAmount
        })
    
        return res.status(200).json({ code:200, })
    } catch(error){
        console.error(error)
        return res.status(500).json({ code:500, error: "Oops, error ocured" })
    }
})

router.post("/", async (req, res)=>{
    try{

    } catch(error) {
            console.error(error)
            return res.status(500).json({ code:500, error: "Oops, error ocured" })
    }
})

module.exports = router;