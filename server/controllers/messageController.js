const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, message, file } = req.body;
    
    const newMessage = new Message({
      roomId,
      senderId,
      receiverId,
      message,
      file: file || null,
      status: 'sent'
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};