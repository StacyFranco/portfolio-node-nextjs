import type { NextApiRequest,NextApiResponse,NextApiHandler } from "next";
import mongoose from 'mongoose';
import type {DefaultAnswerMsg} from '../types/DefaultAnswer'

export const connectMongoDB = (handler : NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse<DefaultAnswerMsg>) =>{
        
        //check if the DATABASE is already connected, if so follow
        // to the endpoint or next middleware
        if(mongoose.connections[0].readyState){
            return handler(req,res);
        }

        // since it is not connected let's connect
        //get the filled environment variable from the env
        const {DB_CONNECTION_STRING} = process.env; 
        
       // if the env is empty, abort the use of the system and notify the programmer
        if(!DB_CONNECTION_STRING){
            return res.status(500).json({error : 'Database configuration ENV not informed'});
        }

        mongoose.connection.on('connected',() => console.log('Connected database'));
        mongoose.connection.on('error', error => console.log('An error occurred while connecting to the Database'));
        await mongoose.connect(DB_CONNECTION_STRING);

        //Now we can move on to the endpoint, as we are already connected to the database
        return handler(req,res);
    }
}