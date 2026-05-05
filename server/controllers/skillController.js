import Skill from '../models/Skill.js';

export const createSkill = async (req, res) => {
  try {
    const { title, category, description, price, pricingMode } = req.body;
    const skill = await Skill.create({
      providerId: req.user._id,
      title,
      category,
      description,
      price,
      pricingMode
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({}).populate('providerId', 'name profilePhoto trustScore');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
