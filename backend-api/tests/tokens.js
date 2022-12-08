import { getToken, verifyAndReturnData } from "../tokens.js"; // Import are handler


(async ()=> {
    let alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890-=[];'#,./"
    let dataToEncode = [...Array(20)].map(()=>{ // create an array of length 20 and loop through it
        return [...Array(10)].map(()=>{ // create an array of 10 and loop through it
            return alphabet[ Math.floor(Math.random() * alphabet.length) ] // return a random character within the alphabet
        }).join("") // return these 10 random letters, joined
    })

    let finalTable = []
    for (const index in dataToEncode) { // Loop through the above data
        let encoded = getToken(dataToEncode[index]) // Encode a token
        let decoded = await verifyAndReturnData(encoded) // decode that token

        finalTable.push({original: dataToEncode[index], encoded: encoded, decoded: decoded.data, testPassed: dataToEncode[index] == decoded.data}) // add test to the table
    }

    console.table(finalTable) // print the table
})()

