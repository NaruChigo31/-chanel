const { DataTypes, Sequelize } = require("sequelize")
const url = "postgres://postgres:postgres@localhost:5432/@channelDB"

const sequelize = new Sequelize(url,{
    dialect: "postgres"
})

const Users = sequelize.define("Users",{
    // id:{
    //     type: DataTypes.UUID,
    //     primaryKey: true,
    //     defaultValue: DataTypes.UUIDV4,
    //     allowNull: false
    // },
    apikey:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

const Admins = sequelize.define("Admins",{
    // id:{
    //     type: DataTypes.INTEGER,
    //     primaryKey: true
    // },
    userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        onDelete: "RESTRICT"
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
})

const Boards = sequelize.define("Boards",{
    // id:{
    //     type: DataTypes.INTEGER,
    //     primaryKey: true
    // },
    tag:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    topic:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    }
})

const Posts = sequelize.define("Posts",{
    // id:{
    //     type: DataTypes.INTEGER,
    //     primaryKey: true
    // },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    text:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: false
    },
    boardId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    },
    threadId:{
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false
    },
    postAnswersIDs:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        unique: false
    },
    userName:{
        type: DataTypes.STRING,
        allowNull: true,
        unique: false
    },
    fileOrigName:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    fileSavedName:{
        type: DataTypes.TEXT,
        allowNull: true,
        unique: false
    },
    isPinned:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        unique: false
    },
    creatorId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false
    }
})

Users.hasOne(Admins,{
    foreignKey: "userId",
    onDelete: "RESTRICT"
})
Admins.belongsTo(Users, {
    foreignKey: "userId",
    onDelete: "CASCADE"
})

Users.hasMany(Posts,{
    foreignKey:{
        name:"creatorId",
        allowNull: false
    }
})
Posts.belongsTo(Users,{
    foreignKey:{
        name:"creatorId",
        allowNull: false
    }
})


Boards.hasMany(Posts,{
    foreignKey: {
        name:"boardId",
        allowNull: false
    }
})
Posts.belongsTo(Boards,{
    foreignKey: {
        name:"boardId",
        allowNull: false
    }
})


// sequelize.sync()
sequelize.authenticate()

module.exports = {
    Users: Users,
    Admins: Admins,
    Boards: Boards,
    Posts: Posts
}