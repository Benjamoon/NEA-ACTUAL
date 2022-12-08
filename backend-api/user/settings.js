import { verifyAndReturnData } from "../tokens.js" // Allows us to check a given token against a username
import { getSettings, setSettings } from "../db.js" // allows us to get and retreive settings.

const settingsHandler = async (req, res) => { // The handler itself
    console.log("Settings handler")

    if (req.method == "POST") { //is a post request, update settings

        if (!req.body.jwt) { // Was a JWT passed?
            res.json({ok: false}) // If not, return a not OK status
            return
        }

        //If a JWT was passed

        let username = req.params["user"] //Get the username in the URL (Who are we trying to update?)
        let dataFromToken = await verifyAndReturnData(req.body.jwt) // Verify the given JWT and grab the data within it.
        let usernameFromToken = dataFromToken.data 

        if (!usernameFromToken || username != usernameFromToken) { // Is token valid and does it belong to the user im trying to edit?
            res.json({ok: false}) //If not, NOT OK
            return
        }

        //Else, set the users settings and return OK status.
        let result = setSettings(username, req.body.settings)
        res.json({ok: true})

        return
    }

    //Is a get request, return settings
    const username = req.params["user"] //Get the username in the URL (Who's settings are we trying to view?)
    let gotSettings = await getSettings(username)
    res.json({ok: true, settings: gotSettings})
}

export default settingsHandler

