import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { DefaultAnswerMsg } from "../types/DefaultAnswer";
import NextCors from "nextjs-cors";

export const policyCORS = (handler : NextApiHandler ) => 
async( req: NextApiRequest, res : NextApiResponse<DefaultAnswerMsg>) =>{
    try{
        await NextCors(req,res,{
            origin : '*',
            methods : ['PUT','POST','GET','DELETE'],
            optionsSuccessStatus : 200, // some old browsers have a problem when returning 204

        });
        return handler(req,res);
    }catch(e){
        console.log('Error when handling CORS policy', e);
        return res.status(500).json({error : 'An error occurred when handling CORS policy'})
    }

}

