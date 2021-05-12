const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title :{
        type:String,
        required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref : 'User',
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    body: {
        type: String,
        required: true,
    },
    votes:{
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Blog',blogSchema);