import reviewModel from "../models/review.model.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find()
      .populate("user", "name email") // Adjust fields as needed
      .populate("mentor", "name"); // Adjust fields as needed

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews by mentor ID
export const getReviewsByMentorId = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ mentor: req.params.mentorId })
      .populate("user", " content")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { user, rating, mentor, content } = req.body;

    const newReview = new reviewModel({
      user,
      rating,
      mentor,
      content
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await reviewModel.findByIdAndDelete(req.params.id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
