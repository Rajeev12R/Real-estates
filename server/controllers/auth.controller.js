import bcrypt from "bcrypt"
import prisma from "../lib/prisma.js"

import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  //db
  const { username, email, password } = req.body

  try {
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    })
    console.log(newUser)
    res.status(201).json({ message: "User Created Successfully" })
} catch (error) {
    console.log(error)
    res.status(501).json({ message: "Failed to Create Account" })
}
}
export const login = async (req, res) => {
    //db
    const {username, password} = req.body;
    try {
        
        // check if user exist 
        const user = await prisma.user.findUnique({
            where: {username}
        })

        if(!user) return res.status(404).json({message: "Invalid Credential"})
            
         // check for password
        
        const isPasswordValid = await bcrypt.compare(password, user.password) 
        if(!isPasswordValid){
        return res.status(404).json({message: "Incorrect Password"})
        }
    
        // check cookie token and send to the user

        // res.setHeader("Set-Cookie", "test=", "myValue").json("success");
        const age = 2*24*3600;

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, {expiresIn: age})


        res.cookie("token", token, {
            httpOnly: true,
            // secure: true
            maxAge: age
        }).status(200).json({messgae:"Login Successful"});
        
        
    } catch (error) {
        console.log(error);
        res.status(501).json({ message: "Failed to login!" })
    
  }
}
export const logout = (req, res) => {
  //db
  res.clearCookie("token").status(201).json({message: "Logged Out Successsfully"})
}
