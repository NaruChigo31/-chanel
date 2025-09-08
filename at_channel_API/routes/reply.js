const express = require('express')
const cors = require('cors');
const { Posts, Admins, Users } = require("../db.js")

// router

const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cors());

async function isAdminCheck(apikey, res, cb){
    let you = await Users.findOne({
        where:{ apikey: apikey }
    })
    if(!you){
        return res.status(403).json({code:403, error: "There's no such a dude in database"})
    } 
    let youAdmin = await Admins.findOne({
        where: {userId: you.dataValues.id}
    })
    if(!youAdmin){
        return res.status(404).json({code:404, error: "You're not admin"})
    }  
    cb()
}


router.delete("/:replyId", async (req, res) =>{

    let yourApikey = req.headers.apikey
    if (!yourApikey){
        return res.status(403).json({code:403, error: "Yo, where is your apikey?"})
    } 
    isAdminCheck(yourApikey, res, async()=>{
        
        reply = await Posts.findOne({
            where:{
                id: req.params.replyId,
                replyId: {
                    [Op.not]: null
                }
            }
        })
        if (!reply){
            return res.status(404).json({code:404, error: "There's no reply with this id"})
        }
        await reply.destroy()

        await Posts.destroy({
            where:{
                replyId: req.params.replyId
            }
        })

        return res.status(200).json({ code:200, notice: `reply ${req.params.replyId} is deleted with all replies`})
    })

})


module.exports = router;