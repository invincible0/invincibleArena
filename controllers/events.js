const Category = require('../models/category');

module.exports.renderEvents = async (req,res)=>{
    const categories = await Category.find({});
    res.render('events/index',{categories});
}

module.exports.renderEvent = (req,res)=>{

}

module.exports.createEvent = (req,res)=>{

}