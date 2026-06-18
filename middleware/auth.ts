import {request,response,next} from "express"
const authMiddleware = (req: request,res: response,next: next) => {
    const apikey=req.headers['x-api-key']
    if(apikey!=MY_KEY){
        return res.status(401).json({message:'Unauthorized'}
    )}
        next()

}