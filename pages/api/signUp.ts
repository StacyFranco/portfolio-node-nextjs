import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultAnswerMsg } from '../../types/DefaultAnswer';
import type { RegistrationRequest } from '../../types/RegistrationRequest';
import { UserModel } from '../../models/UserModel';
import md5 from 'md5';
import { connectMongoDB } from '../../middlewares/connectMongoDB';
import { upload, uploadImageCosmic } from '../../services/uploadImageCosmic';
import nc from 'next-connect'
import { policyCORS } from "../../middlewares/policyCORS";

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<DefaultAnswerMsg>) => {

        try {
            //console.log('signUp endpoint',req.body)

            const user = req.body as RegistrationRequest;

            if (!user.name || user.name.length < 2) {
                return res.status(400).json({ error: 'Invalid name!' });
            }

            if (!user.email
                || user.email.length < 5
                || !user.email.includes('@')
                || !user.email.includes('.')) {
                return res.status(400).json({ error: 'Invalid email!' });
            }

            if (!user.password || user.password.length < 4) {
                return res.status(400).json({ error: 'Invalid password!' });
            }

            // Validation if there is already a user with the same email
            const usersWithSameEmail = await UserModel.find({ email: user.email });
            if (usersWithSameEmail && usersWithSameEmail.length > 0) {
                return res.status(400).json({ error: 'An account already exists with the email provided' });

            }
            // send the multer image to cosmic
            const image = await uploadImageCosmic(req);
            console.log("image.media.url",image)
            //Save to database
            const userToBeSaved = {
                name: user.name,
                email: user.email,
                password: md5(user.password),
                avatar: image?.media?.url
            }
            console.log("userToBeSaved",userToBeSaved)
            await UserModel.create(userToBeSaved);

            return res.status(200).json({ msg: 'User registered successfully!' })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ error: 'Error registering user' })
        }

    });

// Change the configuration of this API so as not to convert the content into JSON
export const config = {
    api: {
        bodyParser: false
    }
}

export default policyCORS(connectMongoDB(handler));