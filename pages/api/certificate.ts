import type { NextApiRequest, NextApiResponse } from "next";
import type { DefaultAnswerMsg } from '../../types/DefaultAnswer';
import { connectMongoDB } from '../../middlewares/connectMongoDB';
import { validateTokenJWT } from '../../middlewares/validateTokenJWT';
import { CertificateModel } from "../../models/CertificateModel";
import { UserModel } from "../../models/UserModel";
import { policyCORS } from "../../middlewares/policyCORS";
import { upload, uploadImageCosmic } from "@/services/uploadImageCosmic";
import nc from 'next-connect';

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res: NextApiResponse<DefaultAnswerMsg>) => {

    try {
      const { userId } = req.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found!' })
      }

      if (!req || !req.body) {
        return res.status(400).json({ error: 'Input parameters not provided!' })
      }
      const { title, description, link } = req.body

      if (!title || title.length < 2) {
        return res.status(400).json({ error: 'Title is not valid!' })
      }

      if (!description || description.length < 2) {
        return res.status(400).json({ error: 'Description is not valid!' })
      }
      if (!link || link.length < 2) {
        return res.status(400).json({ error: 'Link is not valid!' })
      }

      /*  only use if badge is mandatory
      if (!req.file || !req.file.originalname) {
           return res.status(400).json({ error: 'Imagem é obrigatória!' })
       }
       */
      
      const image = await uploadImageCosmic(req);
      const certificate = {
        userId: user._id,
        title,
        description,
        link,
        badge: image?.media.url,
      }


      await CertificateModel.create(certificate);
      return res.status(200).json({ msg: 'Certificate created successfully!' })

    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Error when registering certificate!' })
    }



  })

  .put(async (req: any, res: NextApiResponse<DefaultAnswerMsg>) => {

    try {
      const { userId, id } = req.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found!' })
      }

      const certificate = await CertificateModel.findById(id);

      if (!certificate) {
        return res.status(400).json({ error: 'Certificate not found' });
      }

      const { title, description, link } = req.body

      if (title && title.length > 2) {
        certificate.title = title;
      }

      if (description && description.length > 2) {
        certificate.description;
      }
      if (link && link.length > 2) {
        certificate.link = link;
      }

      /*  only use if badge is mandatory
      if (!req.file || !req.file.originalname) {
           return res.status(400).json({ error: 'Imagem é obrigatória!' })
       }
       */
      
      if (req.file && req.file.originalname) {

        const image = await uploadImageCosmic(req);
        if (image && image.media && image.media.url) {
          certificate.badge = image.media.url;
        }
      }


      await CertificateModel.create(certificate);
      return res.status(200).json({ msg: 'Certificate updated successfully!' })

    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Error when updating certificate!' })
    }

  })
  .delete(async (req: any, res: NextApiResponse<DefaultAnswerMsg>) => {
    try {
      const { userId, id } = req.query;
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found!' })
      }

      await CertificateModel.findByIdAndDelete(id);
      return res.status(200).json({ msg: 'Certificate deleted successfully!' })


    } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'Error when deleting certificate!' })
  }
  })
  
  .get(async (req: any, res:  NextApiResponse<DefaultAnswerMsg | any>) => {
    try {

      const { userId } = req?.query;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(400).json({ error: 'User not found!' })
      }
      user.senha = null;
      
      const certificates = await CertificateModel.find({userId:user._id})
      return res.status(200).json(certificates);

  } catch (e) {
      console.log(e);
      return res.status(400).json({ error: `Unable to obtain user's certificates` });
  }
  })  ;

export const config = {
  api: {
    bodyParser: false
  }
}

export default policyCORS(validateTokenJWT(connectMongoDB(handler)));
