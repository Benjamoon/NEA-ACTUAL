import jwt from "jsonwebtoken"

const secret = 'BT9c`i9_CgwPMkM}iN-0#T*cPJAZvi08c^+"ihB5~z2w:dk/yjNP?T[M9Ge2`k@'


// Take in a username and return a signed token for the user.
export function getToken(username) {
    return jwt.sign({
        data: username
    }, secret); // sign a token with the username as the encoded data. Use the secret key for this.
}

// Private function
// Verify the tokens integrity against the secret key.
function verifyToken(token) {
    try {
        return jwt.verify(token, secret)
    } catch {
        return false
    }
}

// Private function
// Returns the decoded data. Shouldnt be used directly
function dataFromToken(token) {
    try {
        return jwt.decode(token)
    } catch {
        return false
    }
}

//Do both of the above
export async function verifyAndReturnData(token) {
    const valid = await verifyToken(token)
    if (!valid){
        return false
    }
    return await dataFromToken(token)
}

