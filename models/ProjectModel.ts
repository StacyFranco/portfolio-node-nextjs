import mongoose, {Schema} from 'mongoose';

const ProjectSchema = new Schema({
    userId: {type : String, required : true},
    badge: {type : String, required : true},
    lilnk: {type : String, required : true},
    name: {type : String, required : true},
    description: {type : String, required : true},

});

// Check to see if the certificate table already exists in the database. If there isn't create one
export const ProjectModel = (mongoose.models.projects ||
    mongoose.model('projects', ProjectSchema));