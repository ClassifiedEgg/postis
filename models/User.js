const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    followers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            }
        }
    ],
    following: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "user"
            },
            name: {
                type: String
            }
        }
    ],
    avatar: {
        type: String
    },
    postsMade: [
        {
            post: {
                type: Schema.Types.ObjectId,
                ref: "post"
            }
        }
    ],
});

module.exports = User = mongoose.model("user", UserSchema);