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
    const { category, search, page = 1, limit = 12 } = req.query;
    const match = { isActive: true };

    if (category && category !== 'All') {
      match.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const searchRegex = search ? new RegExp(search, 'i') : null;

    const basePipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'freelancerId',
          foreignField: '_id',
          as: 'freelancerId'
        }
      },
      { $unwind: '$freelancerId' }
    ];

    if (searchRegex) {
      basePipeline.push({
        $match: {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { 'freelancerId.name': searchRegex }
          ]
        }
      });
    }

    const countPipeline = [...basePipeline, { $count: 'count' }];
    const dataPipeline = [
      ...basePipeline,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) }
    ];

    const [countResult, services] = await Promise.all([
      Service.aggregate(countPipeline),
      Service.aggregate(dataPipeline)
    ]);

    const total = countResult[0]?.count || 0;

    res.json({
      services,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
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
