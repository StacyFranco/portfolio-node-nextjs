import { NextApiRequest, NextApiResponse } from 'next';
import type { DefaultAnswerMsg } from '../../types/DefaultAnswer';
import { validateTokenJWT } from '../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../middlewares/connectMongoDB';
import { UserModel } from '../../models/UserModel';
import nc from 'next-connect';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import { policyCORS } from '../../middlewares/policyCORS';

const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<DefaultAnswerMsg>) => {
        try {
            const { userId } = req?.query;
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            // update avatar
            const { file } = req;
            if (file && file.originalname) {
                const image = await uploadImageCosmic(req);
                if (image && image.media && image.media.url) {
                    user.avatar = image.media.url;
                }

            }
            // update itens from user (no lang changes)
            const { name, adress, socialMediaLinks } = req.body
            console.log("req.body",req.body)
            // validação se tem um alteração de nome com nome valido!
            if (name && name.length > 2) {
                user.name = name;
            }
            if (adress && adress.length > 2) {
                user.adress = adress;
                
            }
            if (socialMediaLinks && socialMediaLinks.length > 0) {
                user.socialMediaLinks = socialMediaLinks;
            }

            // updating itens with lang:

            //lang1:
            const {country1,expertise1,skills1,resumeURL1} =req.body;

            
            //console.log("user",user)
            await UserModel.findByIdAndUpdate({ _id: user._id}, user );
            return res.status(200).json({ msg: 'user successfully updated' })

        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Unable to update user' });
        }

    })

    .get(async (req: NextApiRequest, res: NextApiResponse<DefaultAnswerMsg | any>) => {
        try {

            const { userId } = req?.query;
            const user = await UserModel.findById(userId);
            user.senha = null;
            return res.status(200).json(user);

        } catch (e) {
            console.log(e);
            return res.status(400).json({ erro: 'Unable to obtain user data' });
        }



    });

export const config = {
    api: {
        bodyParser : false
    }
}

export default policyCORS(validateTokenJWT(connectMongoDB(handler)));