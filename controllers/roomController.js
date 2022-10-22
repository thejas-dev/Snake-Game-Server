
const Room = require('../models/RoomModel');

module.exports.createRoom = async(req,res,next)=>{
	try{
		const {name,users} = req.body;
		const user = Room.create({
			name,users
		}).then(result=>{
			console.log(result)
			return res.json({status:true,result})
		})		
	}catch(ex){
		next(ex)
	}
}

module.exports.checkRooms = async(req,res,next)=>{
	try{
		const{name} = req.body;
		console.log(name)
		const {data} = Room.find({name},(err,docs)=>{
			if(err){
				console.log(err)
			}else{
				if(docs.length>0){
					return res.json({status:true,msg:"Room Found",docs});
				}else{
					return res.json({status:false,msg:"No Room With This Name",docs});
				}
			}
		})
	}catch(ex){
		next(ex)
	}
} 

module.exports.joinRoom = async(req,res,next)=>{
	try{
		const roomId = req.params.id;
		const {users} = req.body;
		console.log(roomId)
		const {data} = Room.findByIdAndUpdate(roomId,{
			users
		},{new:true},(err,docs)=>{
			if(err){
				console.log(err)
				return res.json({msg:"Failed to Add User",stats:false,err})
			}
			return res.json(docs)
		})
	}catch(ex){
		next(ex)
	}
}


module.exports.editPosition = async(req,res,next)=>{
	try{
		const {users,roomId} = req.body;
		console.log(roomId)
		const {data} = Room.findByIdAndUpdate(roomId,{
			users
		},{new:true},(err,docs)=>{
			if(err){
				return res.json({msg:"Failed to Update Position",status:false})
			}
			return res.json(docs)
		})
	}catch(ex){
		next(ex)
	}
}