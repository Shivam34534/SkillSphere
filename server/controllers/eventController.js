import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, type } = req.body;
    
    if (req.user.role !== 'CLUB') {
      return res.status(403).json({ message: 'Only clubs can schedule events' });
    }

    const event = await Event.create({
      clubId: req.user._id,
      title,
      description,
      date,
      location,
      type
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('clubId', 'name trustScore');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubEvents = async (req, res) => {
  try {
    const events = await Event.find({ clubId: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
