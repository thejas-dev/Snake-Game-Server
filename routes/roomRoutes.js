const {checkRooms,createRoom,joinRoom,editPosition} = require('../controllers/roomController')

const router = require('express').Router();

router.post('/checkRoom',checkRooms);
router.post('/createRoom',createRoom);
router.post('/joinRoom/:id',joinRoom);
router.post('/editPosition',editPosition)

module.exports = router;