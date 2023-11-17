import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { DefaultAnswerMsg } from '../types/DefaultAnswer';
import jwt, { JwtPayload } from 'jsonwebtoken';


export const validateTokenJWT = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<DefaultAnswerMsg>) => {

        try {
            const { TOKEM_KEY_JWT } = process.env;
            
            if (!TOKEM_KEY_JWT) {
                return res.status(500).json({ error: 'ENV JWT key not informed when executing the process' });
            }

            if (!req || !req.headers) {
                return res.status(401).json({ error: 'Unable to validate access token' });
            }

            if (req.method !== 'OPTIONS') {
                const authorization = req.headers['authorization'];
                if (!authorization) {
                    return res.status(401).json({ error: 'Unable to validate access token' });
                }

                const token = authorization.substring(7);
                
                if (!token) {
                    return res.status(401).json({ error: 'Unable to validate access token' });
                }
                const decoded = jwt.verify(token, TOKEM_KEY_JWT) as JwtPayload;

                if (!decoded) {
                    return res.status(401).json({ error: 'Unable to validate access token' });
                }

                if (!req.query) {
                    req.query = {};
                }

                req.query.userId = decoded._id;
            }
        } catch (e) {
            console.log(e);
            return res.status(401).json({ error: 'Unable to validate access token' });
        }



        return handler(req, res);

    }