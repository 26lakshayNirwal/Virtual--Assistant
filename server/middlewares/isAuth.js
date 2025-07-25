import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token ;
        if (!token) {
            return res.status(401).json({ message: 'Authentication failed, token not provided' });
        }

        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        req.userId = verifyToken.userId; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
        
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: 'Authentication failed, invalid token' });
    }
}  

export default isAuth;