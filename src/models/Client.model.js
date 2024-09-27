import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            //required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            //unique: true,
            //validate: [
            //    (val) => /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/.test(val),
            //]
            validate: {
                validator: function(val) {
                    console.log("+++++++++++++++++++++++++++++++++++++++", val)
                    if(!val) {
                        return true;
                    }
                    // Permitir valores nulos o undefined
                    if (val === null || val === undefined) {
                        return true;
                    }
                    // Validar el formato del email si no es null o undefined
                    return /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/.test(val);
                },
                message: props => `${props.value} is not a valid email!`
            }
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true
        },
        
    },
    {
        timestamps: true
    }
)

const Client = mongoose.model('Client', ClientSchema);
export default Client;