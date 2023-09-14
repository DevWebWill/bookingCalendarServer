import mongoose from "mongoose";

const allowedRoles = ['ROLE_SUPERADMIN', 'ROLE_ADMIN', 'ROLE_USER', 'ROLE_GUEST'];

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        company: {
            type: String
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            validate: [
                //(val) => /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/.test(val),
                (val) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val),
                //(val) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(val)
            ]
        },
        first_name: {
            type: String,
            required: true
        },
        roles: {
            type: [{
                type: String,
                enum: allowedRoles,
            }],
            default: ["ROLE_GUEST"],
            
        },
        password: {
            type: String,
            required: true,
            min: 8
        },
        country: {
            type: String
        },
        type_of_trade: {
            type: String
        },
        website: {
            type: String
        },
        full_record: {
            type: Boolean,
            default: false,
            required: true
        },

        refresh_token: String
    },
    {
        timestamps: true,
        virtuals: {
            full_name: {
                get() {
                    return this.first_name + ' ' + this.last_name
                }
            }
        }
    }
)

const User = mongoose.model('User', UserSchema);
export default User;