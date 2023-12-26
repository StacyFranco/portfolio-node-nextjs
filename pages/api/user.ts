import nc from 'next-connect';
import { NextApiRequest, NextApiResponse } from 'next';
import { policyCORS } from '../../middlewares/policyCORS';
import { validateTokenJWT } from '../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../middlewares/connectMongoDB';
import type { DefaultAnswerMsg } from '../../types/DefaultAnswer';
import { UserModel } from '../../models/UserModel';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';

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
            // update itens from user (no langData changes)

            const { name, adress, socialMediaLinks } = req.body
            console.log("req.body", req.body)
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

            // updating itens with langData:

            const { language, country, resumeURL, expertise, skills, homePage } = req.body;
            //find if you already have data in this language:
            const LangId = user.langData.findIndex((langdata: any) => langdata.language === language)
            const langDataSize = user.langData.length

            // if language already exist update position. if not create new position
            const DataPosition = LangId >= 0 ? LangId : langDataSize
            
            if(LangId<0){user.langData.push({})} // creating object to new langData array
            
            if (LangId<0 && language && language.length > 1) {
                
                user.langData[DataPosition].language = language;
                
            }

            if (country && country.length > 2) {
                user.langData[DataPosition].country = country;
            }
            if (resumeURL && resumeURL.length > 2) {
                user.langData[DataPosition].resumeURL = resumeURL;
            }

            if (expertise && expertise.length > 0) {
                user.langData[DataPosition].expertise = expertise;
            }
            if (skills && skills.length > 0) {
                user.langData[DataPosition].skills = skills;
            }

            if (homePage.title && homePage.title.length > 0) {
                user.langData[DataPosition].homePage.title = homePage.title;
            }


            //console.log("user",user)
            await UserModel.findByIdAndUpdate({ _id: user._id }, user);
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
            return res.status(400).json({ error: 'Unable to obtain user data' });
        }



    });

export const config = {
    api: {
        bodyParser: false
    }
}

export default policyCORS(validateTokenJWT(connectMongoDB(handler)));