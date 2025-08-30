const express = require('express')
const { Boards, Users, Admins } = require("../db.js")

const cors = require('cors');

const spacesInText = [" ","\n","\t"]


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

function filterSpaces(field){
    return field.split("").filter((element) => !spacesInText.includes(element))
}


router.post("/", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
        try{
            let { body } = req
            const tag = body.tag.trim().toLowerCase()
            const topic = body.topic.trim()
            const description = body.description.trim()

            if(!tag || filterSpaces(tag).length < 1){
                return res.status(400).json({ code:400, error:"Tag is at least 1 symbol" })
            }
            else if (tag.trim().split(" ").length > 1){
                return res.status(400).json({ code:400, error:"Tag is 1 word only" })
            }
            else if (tag.trim().split(" ")[0].length > 5){
                return res.status(400).json({ code:400, error:"Tag is maximum 5 symbols" })
            }


            if(!topic || filterSpaces(topic).length < 1){
                return res.status(400).json({ code:400, error:"Where is the topic?" })
            }


            if(!description || filterSpaces(topic).length < 1){
                return res.status(400).json({ code:400, error:"Where is the description?" })
            }



            let board = await Boards.create({
                tag: tag,
                topic: topic,
                description: description
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

router.get("/:tag", async (req, res)=>{

    let board = await Boards.findOne({
        where:{
            tag: req.params.tag 
        }
    })
    
    if (!board){
        return res.status(404).json({code:404, error: "There's no such a page"})
    }
    return res.status(200).json({code:200, board: board})
})

router.delete("/:tag", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
        try{
            const tag = req.params.tag
            let board = await Boards.findOne({
                where:{
                    tag : tag
                }
            })
            if(!board){
                return res.status(404).json({ code: 404, error: "Oops, looks like there's no board found" })
            }
            const topic = board.dataValues.topic
            board.destroy()
        
            return res.status(200).json({ code:200, message:`yo, board /${tag}/ - ${topic} is deleted` })
        } catch(error){
            console.error(error)
            return res.status(500).json({ code:500, error: "Oops, error ocured" })
        }
    })

})

router.put("/:tag", async (req, res) =>{
    let apikey = req.headers.apikey
    if (!apikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(apikey, res, async()=>{
        try{
            const prevTag = req.params.tag
            console.log(prevTag.length)
            let board = await Boards.findOne({
                where:{
                    tag : prevTag
                }
            })
            if(!board){
                return res.status(404).json({ code: 404, error: "Oops, looks like there's no board found" })
            }
    
            prevTopic = board.dataValues.topic

            let { body } = req
    
            if(body.topic){
                board.update({topic: body.topic})
            }
            if(body.description){
                board.update({description: body.description})
            }
            // updated at the end as used like id
            if(body.tag){
                board.update({tag: body.tag})
            }
            
            board.save()
            return res.status(200).json({ code:200, message:`yo, board is updated` })
        } catch(error){
            console.error(error)
            return res.status(500).json({ code:500, error: "Oops, error ocured" })
        }
    })

})

module.exports = router;