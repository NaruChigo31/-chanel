const express = require('express')
const { Boards, Users, Admins } = require("../db.js")

const cors = require('cors');

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

router.post("/", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
        try{
            let { body } = req
            const tag = body.tag
            const topic = body.topic
        
            if(!tag){
                return res.status(400).json({ code:400, error:"Where is the tag?" })
            }
            if(!topic){
                return res.status(400).json({ code:400, error:"Where is the topic, dude?" })
            }
            
            let board = await Boards.create({
                tag: tag,
                topic: topic
            })
    
            return res.status(201).json({ code:201,  message:"yo, board is created", board: board })
            
        } catch(error) {
            console.error(error)
            return res.status(500).json({ code:500, error: "Oops, error ocured" })
        }
    })
})

router.get("/", async (req, res) =>{
    let boards = await Boards.findAll()
    
    if (boards.length <= 0){
        return res.status(404).json({code:404, error: "There's no boards"})
    }
    return res.status(200).json({code:200, boards: boards})
})

router.delete("/:id", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
            try{
                let id = Number(req.params.id)
        
                if(`${id}` == "Nan" || !id){
                    return res.status(400).json({ code:400, error: "yo, what's an id of the board?" })
                }
                let board = await Boards.findOne({
                    where:{
                        id : id
                    }
                })
                if(!board){
                    return res.status(404).json({ code: 404, error: "Oops, looks like there's no board found" })
                }
                let tag = board.dataValues.tag
                let topic = board.dataValues.topic
                board.destroy()
            
                return res.status(200).json({ code:200, message:`yo, board /${tag}/ - ${topic} is deleted` })
            } catch(error){
                console.error(error)
                return res.status(500).json({ code:500, error: "Oops, error ocured" })
            }
    })

})

router.put("/:id", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
        try{
            let id = Number(req.params.id)
    
            if(`${id}` == "Nan" || !id){
                return res.status(400).json({ code:400, error: "yo, what's an id of the board?" })
            }
            let board = await Boards.findOne({
                where:{
                    id : id
                }
            })
            if(!board){
                return res.status(404).json({ code: 404, error: "Oops, looks like there's no board found" })
            }
            
            let { body } = req
    
            if(body.tag){
                board.update({tag: body.tag})
            }
            if(body.topic){
                board.update({topic: body.topic})
            }
        
            board.save()
            return res.status(200).json({ code:200, message:"yo, board is updated" })
        } catch(error){
            console.error(error)
            return res.status(500).json({ code:500, error: "Oops, error ocured" })
        }
    })

})

module.exports = router;