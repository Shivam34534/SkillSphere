import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  try {
    const { gigId, receiverId, message } = req.body;
    const chat = await Chat.create({
      gigId,
      senderId: req.user._id,
      receiverId,
      message
    });
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ gigId: req.params.gigId })
      .populate('senderId', 'name profile.avatar')
      .sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
