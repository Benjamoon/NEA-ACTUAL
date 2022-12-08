import { attemptLogin } from "../db.js"
import { getToken, verifyAndReturnData } from "../tokens.js"

const loginHandler = async (req, res) =>{

    if (req.body.jwt) { // Is a JWT given?
        const decoded = await verifyAndReturnData(req.body.jwt) // decode the JWT
        if (!decoded) { // token was invalid
            res.json({ok: false}) // return a NOT ok status
            return
        }

        res.json({ok: true, username: decoded.data}) // return true along with the users username.
        
        return
    }
    // JWT wasnt given, so assume username and password instead.

    const user = await attemptLogin(req.body.username, req.body.password) //Attempt a login with the given username and password.
    if (!user) { // user object was not given, so username or password was wrong.
        res.json({ok: false}) // return false
        return
    }

    //user was found, so we need to get and return the appropriate token to the user.

    res.json({ok: true, token: getToken(req.body.username)})
}

export default loginHandler
