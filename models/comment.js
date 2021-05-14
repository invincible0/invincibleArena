const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body:{
        type:String,
        required:true,
    },
    votes:{
        type: Number,
        default:0,
    },
    date:{
        type:Date,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Comment',commentSchema);