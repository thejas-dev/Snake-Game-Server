const mongoose = require('mongoose');

const RoomModel = new mongoose.Schema({
	name:{
		type:String,
		min:3,
		max:20,
		unique:true,
	},
	users: Array,
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('Rooms',RoomModel);