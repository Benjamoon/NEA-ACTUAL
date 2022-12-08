import { createNewUser, checkUsername } from "../db.js" // db handlers required
import { getToken } from "../tokens.js" // token handler

const signupHandler = async (req, res) =>{

    let userExists = await checkUsername(req.body.username) //Check whether the username already exists (true or false as we didnt pass returnUser)
    if (userExists) {
        res.json({ok: false, err: "Username taken"}) // If username exists, return with an error
        return //End execution of this function
    }

    try {
        await createNewUser(req.body.username, req.body.email, req.body.password) //Try and create a new user with the password username, email and password
        console.log("Created user")

        res.json({ok: true, token: getToken(req.body.username)}) // Return an ok status along with the user token
        return
    } catch (err) {
        console.log(err)
        res.json({ok: false, err: "Server error..."}) // If an internal error occurs, return this error
        return
    }
}

export default signupHandler

