import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false },
    socialMediaLinks: { type: Array, required: false },
    adress: { type: String, required: false },
   
    lang1data: {
        country: { type: String, require: false },
        expertise: { type: [String], require: false },
        skills: { type: Array, require: false },
        resumeURL: { type: String, require: false },
        
        homePage:{
            title:{ type: [String], require: false },
            content:{ type: [String], require: false },
            buttons:{ type: [String], require: false },
        },
       
        aboutPage:{
            title:{ type: [String], require: false },
            content:{ type: [String], require: false },
            buttons:{ type: [String], require: false },
        },
        
        certificatesPage:{
            title:{ type: [String], require: false },
            content:{ type: [String], require: false },
            buttons:{ type: [String], require: false },
        },
        
        potfolioPage:{
            title:{ type: [String], require: false },
            content:{ type: [String], require: false },
            buttons:{ type: [String], require: false },
        },
        
        contactPage:{
            title:{ type: [String], require: false },
            content:{ type: [String], require: false },
            buttons:{ type: [String], require: false },
        },
    }
    

});

export const UserModel = (mongoose.models.users ||
    mongoose.model('users', UserSchema));