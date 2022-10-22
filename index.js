const socket = require('socket.io')
const express = require('express')
const cors = require('cors')
const app=express();
const mongoose = require('mongoose');
require('dotenv').config();
const roomRoutes = require("./routes/roomRoutes");

app.use(cors())
app.use(express.json())

app.use('/api/auth',roomRoutes);

mongoose.connect(process.env.MONGO_ID,{
	useNewUrlParser:true,
	useUnifiedTopology:true,
}).then(()=>{
	console.log("db connection successfull");
}).catch((err)=>{
	console.log(err)
})


app.get('/',(req,res)=>{
	res.send(`
		<h1>Hello World</h1>
		`)
})

const PORT = process.env.PORT || 3333;

const Server = app.listen(PORT,()=>{
	console.log(`App is Listening at Port ${PORT} `)
})


const io = socket(Server,{
	cors:{
		origin:"https://snakenbite.vercel.app",
		credentials:true,
	},
})

global.onlineUsers = new Map();

io.on("connection",(socket)=>{
	socket.on('joinroom',({room,name,data})=>{
		socket.join(room);
		let res = {
			name:name,
			data:data
		}
		io.sockets.in(room).emit("userJoined",res);
	})
	socket.on('removeRoom',({currentRoom})=>{
		socket.leave(currentRoom)
	})
	socket.on('showplayers',(room)=>{
		const users = io.sockets.adapter.rooms.get(room);
		socket.emit('players',users)
	})
	socket.on('userRemoved',({currentRoom,name,data})=>{
		let res = {
			name:name,
			data:data
		}

		io.sockets.in(currentRoom).emit('userRemovedMsg',res);
	})
	socket.on('result',(resWithRoom)=>{
		const room = resWithRoom.room;
		io.sockets.in(room).emit("recieve",resWithRoom.response);
	})
	socket.on('changePosition',({newUsers,currentRoom})=>{
		io.sockets.in(currentRoom).emit("recievePosition",newUsers);
	})
	socket.on('extraMoveOn',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('extraMoveGoing',currentRoom);
	})
	socket.on('extraMoveOff',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('extraMoveStopped',currentRoom);
	})
	socket.on('snakeBite',({room})=>{
		console.log(room)
		io.sockets.in(room).emit('recieveSnakeBite',room);
	})
	socket.on('ladderBite',({room})=>{
		console.log(room)
		io.sockets.in(room).emit('recieveLadderBite',room);
	})
	socket.on('showSnake',({currentRoom})=>{
		io.sockets.in(currentRoom).emit('snakeShow',currentRoom);
	})
	socket.on('winner',({name,currentRoom})=>{
		let res = {
			name:name,
			currentRoom:currentRoom
		}
		socket.broadcast.emit('winnerIn',res)
	})

})