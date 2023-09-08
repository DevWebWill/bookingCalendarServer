import mongoose from 'mongoose';

const DemoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        lastname: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        status: {
            type: String,
            enum: ["activada", "desactivada"],
            default: "activada"
        }
    },
    { timestamps: true }
);

const Demo = mongoose.model("Demo", DemoSchema);
export default Demo;