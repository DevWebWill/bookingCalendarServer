import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            //unique: true,
            validate: [
                (val) => /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/.test(val),
            ]
        },
        
    },
    {
        timestamps: true
    }
)

const Client = mongoose.model('Client', ClientSchema);
export default Client;