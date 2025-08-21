
const jwt = require('jsonwebtoken');

const verifyToken = (req,res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1];
        console.log("auth token",token)
    
    if (!token) {
        return res.status(401).json({message: 'Access Denied'})
    }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("The user is: ", req.user);
            next();
        } catch(err) {
            return res.status(401).json({message: 'Invalid token',err})
        }
    } else {
        return res.status(401).json({message: 'No token provided'})
    }
}


module.exports = verifyToken;