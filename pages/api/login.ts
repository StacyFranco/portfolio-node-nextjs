import type {NextApiRequest,NextApiResponse} from 'next';
import { connectMongoDB } from '@/middlewares/connectMongoDB'; 
import type {DefaultAnswerMsg} from '../../types/DefaultAnswer'
import type {LoginAnswer} from '../../types/LoginAnswer'
import {UserModel} from '../../models/UserModel';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import { policyCORS } from '../../middlewares/policyCORS';

const endpointLogin = async (
    req : NextApiRequest,
    res : NextApiResponse<DefaultAnswerMsg | LoginAnswer>
) =>{

    const {TOKEM_KEY_JWT} = process.env;
    if(!TOKEM_KEY_JWT){
        res.status(500).json({error : 'ENV JWT not informed'});
    }


    if(req.method=== 'POST'){
        const{login,password} = req.body;

        const usersFound = await UserModel.find({email: login, password: md5(password)});
        if(usersFound && usersFound.length > 0){
            const userFound = usersFound[0]; // make sure if only recive one!
           
            const token = jwt.sign({_id : userFound._id}, TOKEM_KEY_JWT!);
            
            return res.status(200).json({
                name : userFound.name,
                email : userFound.email,
                 token});
        }
        return res.status(400).json({error : 'Username or password not found'});
    }
    return res.status(405).json({error : 'Method provided is not valid'});
}

export default policyCORS(connectMongoDB (endpointLogin));