const User = require('../models/User')
const bcrypt = require('bcrypt')

// @desc Create new user
// @route POST /users
// @access Private
const createUser = async (req, res) => {

    const {username, password, role} = req.body

    if(!username || !password) {
        return res.status(400).json({message: "All fields are required, you are missing username or password!"})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate) {
        return res.status(409).json({message: "Username already in use, try again !"})
    }

    const hashedPw = await bcrypt.hash(password, 10)
   
    const user = await User.create({username, "password": hashedPw, role})

    if(user){
        res.status(200).json({message: `User with username: ${username} created successfully!`})
    } else{
        res.status(400).json({message: "Invalid user data entered"})
    }

}

module.exports = {
    createUser
}