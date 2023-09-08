import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 150,
        },
        mimetype: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        destination: {
            type: String,
            required: true,
            min: 2,
            max: 250,
        },
        status: {
            type: String,
            enum: ["activada", "desactivada"],
            default: "activada"
        }
    },
    { timestamps: true }
);

const Media = mongoose.model("Media", MediaSchema);
export default Media;