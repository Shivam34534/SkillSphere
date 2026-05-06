import Service from '../models/Service.js';

export const createService = async (req, res) => {
  try {
    const { title, description, category, pricing, deliveryTimeDays } = req.body;
    const service = await Service.create({
      freelancerId: req.user._id,
      title,
      description,
      category,
      pricing,
      deliveryTimeDays
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).populate('freelancerId', 'name trustScore xpLevel profilePhoto') || [];
    res.json(services);
  } catch (error) {
    console.error('Get Services Error:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const purchaseService = async (req, res) => {
  // Logic for a student or club to purchase a service
  // In a real app, this would deduct credits/cash and create an Order
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // Simulate purchase success
    res.json({ message: 'Service purchased successfully', serviceId: service._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
