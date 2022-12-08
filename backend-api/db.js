import { JsonDB, Config } from 'node-json-db';
import bcrypt from "bcrypt"

var users = new JsonDB(new Config("users", true, true, '/')); // Create a new Database called users

//Create a new user
export async function createNewUser(username, email, password){

    username = username.toLowerCase() // Convert the username to lower case

    const hashedPassword = await bcrypt.hash(password, 10) // hash the users password using 10 saltRounds

    await users.push(`/${username}`, { 
        email: email,
        password: hashedPassword //Using the hashed password not the plain text.
    }) // This can then be inserted into the database under the index of the username (as this is a primary key).

    return await users.getData(`/${username}`) //Return the data for that user so we can sign them in
}

//Check if a user exists with username
export async function checkUsername(username, returnUser){

    username = username.toLowerCase() // username to lowercase

    try {
        const foundUser = await users.getData(`/${username}`) //Try to find a user by that username
        return returnUser?foundUser:true //Depending on whether returnUser was password, either return true or the user object
    } catch {
        return false //If the above errored, user didnt exist, so return false.
    }
}

//Check if a user exists with username and verify password, if correct, return user
export async function attemptLogin(username, password){

    username = username.toLowerCase() // convert the username to lowercase

    const user = await checkUsername(username, true) // see if the username exists, passing true in order to return the user object if found
    if (!user) {
        return false // if the user doesnt exist, return false
    }
    
    const correctPassword = await bcrypt.compare(password, user.password) // compare the given password to the stored password
    if (!correctPassword) {
        return false // if the password was incorrect, return false
    }

    return user //else, return the user object
}

//get a users settings
export async function getSettings(username) {
    username = username.toLowerCase()

    try {
        let settings = await users.getData(`/${username}/settings`)
        console.log(settings)
        return settings
    } catch (err) {
        console.error(err)
        return false
    }
}

//set a users settings
export async function setSettings(username, settings) {
    username = username.toLowerCase()

    try {
        await users.push(`/${username}/settings`, settings)
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

