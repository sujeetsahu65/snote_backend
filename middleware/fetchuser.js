const jwt = require('jsonwebtoken');

let JWT_SECRET = "^$^%$jhbjhhjk";
const fetchuser = (req,res,next)=>{

const token = req.header('auth-token');
if(!token){
    res.status(401).json({error:"Missing auth-token"});
}


try {
    const data = jwt.verify(token, JWT_SECRET);
req.user = data.user;//to get the user(here we appended the userid in the req)
/*
//req.user is nothing but a custom key of req object.
But generally, it is inserted from the authorization middleware where we compare user by the token. (JWT).
Note: You can put any data in it and also with a different key like req.body.yourKey

*/
next();
} catch (error) {
     res.status(401).json({error:"Missing auth-token"});
}
}

module.exports = fetchuser;