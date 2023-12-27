import type { NextApiRequest, NextApiResponse } from 'next';
import { connectMongoDB } from '@/middlewares/connectMongoDB';
import type { DefaultAnswerMsg } from '../../types/DefaultAnswer'
import { UserModel } from '../../models/UserModel';
import { policyCORS } from '../../middlewares/policyCORS';
import { CertificateModel } from '@/models/CertificateModel';
import { ProjectModel } from '@/models/ProjectModel';

const endpointPortfolio = async (
    req: NextApiRequest,
    res: NextApiResponse<DefaultAnswerMsg | any>
) => {

    if (req.method === 'GET') {
        try {
            const { Id } = req?.query;
            const user = await UserModel.findById(Id);

            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            user.senha = null;

            // define what to get:
            const { getWhat } = req?.query;

            switch (getWhat) {
                case `user`:
                    return res.status(200).json(user);
                case 'certificates':
                    const certificates = await CertificateModel.find({ userId: user._id })
                    return res.status(200).json(certificates);
                case 'projects':
                    const projects = await ProjectModel.find({ userId: user._id })
                    return res.status(200).json(projects);
                default:
                    return res.status(400).json({ error: `Unable to identify data request` });
            }

        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: `Unable to obtain user's data` });
        }

    }
    return res.status(405).json({ error: 'Method provided is not valid' });
}

export default policyCORS(connectMongoDB(endpointPortfolio));