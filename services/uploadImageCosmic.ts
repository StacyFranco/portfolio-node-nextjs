import multer from "multer";
import { createBucketClient } from "@cosmicjs/sdk";

const{ BUCKET_SLUG, WRITE_KEY, READ_KEY } = process.env;

const bucketPortfolio = createBucketClient({
    bucketSlug: BUCKET_SLUG as string,
    readKey: READ_KEY as string,
    writeKey: WRITE_KEY as string,
});

const storage = multer.memoryStorage();

const upload = multer({storage : storage});

const uploadImageCosmic = async( req : any) => {
   //console.log('uploadImageCosmic',req.body)
   
    if(req?.file?.originalname){
        if(
        !req.file.originalname.includes(".png") &&
        !req.file.originalname.includes(".jpg") &&
        !req.file.originalname.includes(".jpeg")&&
        !req.file.originalname.includes(".svg")
        ) {
            throw new Error("Invalid image extension");
        }
    
        const media_object = {
            originalname : req.file.originalname,
            buffer : req.file.buffer
        };
        //console.log('uploadImagemCosmic url',req.url)
        //console.log('uploadImagemCosmic media_object',media_object)


        if(req.url && req.url.includes('signUp')){
            return await bucketPortfolio.media.insertOne({
                media : media_object,
                folder: "avatar",
            });
        }else if(req.url && (req.url.includes('certificates'))|| req.url.includes('usuario')){// estava usuario na aula...
            return await bucketPortfolio.media.insertOne({
                media: media_object,
                folder: "certificates",
            });
        }else{
            return await bucketPortfolio.media.insertOne({
                media: media_object,
                folder: "projects",
            });
        }
    }         
};

export {upload, uploadImageCosmic};
