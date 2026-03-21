const jwt= require("jsonwebtoken");

const authmiddleware= (req,res,next)=>{
    const authHeader= req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("bearer")){
        return res.status(404).json({})
    }

    const token= authHeader.split(' ')[1];

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        if(decoded.userId){
            req.userId= decoded.userId;
            next();
        }
    }
    catch(err){
        return res.status(403).json({message:"error"})
    }
}

module.exports= authmiddleware;