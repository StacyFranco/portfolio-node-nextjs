import mongoose, {Schema} from 'mongoose';

const CertificateSchema = new Schema({
    userId: {type : String, required : true},
    title: {type : String, required : true},
    badge: {type : String },
    description: {type : String, required : true},
    link: {type : String, required : true},

    
});

// Check to see if the certificate table already exists in the database. If there isn't create one
export const CertificateModel = (mongoose.models.certificates ||
    mongoose.model('certificates', CertificateSchema));