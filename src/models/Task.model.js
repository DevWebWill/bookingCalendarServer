import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        /* client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }, */
        descriptions: {
            type: String,
            default: ''
        },
        date: {
            type: Date,
            required: true
        }, 
        time: {
            type: Number,
            required: true
        },
        reservations_available: {
            type: Number,
            default: 1
        },
        number_of_reserved: {
            type: Number,
            default: 0
        },
        availability: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', TaskSchema);
export default Task;