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
    // Convert all reviews' mentor IDs to strings for comparison
    const allReviews = await reviewModel.find();
    const mentorIdString = req.params.mentorId;
    
    // Filter reviews manually
    const filteredReviews = [];
    for (const review of allReviews) {
      // Convert ObjectId to string for comparison
      const reviewMentorId = review.mentor.toString();
      if (reviewMentorId === mentorIdString) {
        filteredReviews.push(review);
      }
    }
    
    // Populate the filtered reviews
    for (let i = 0; i < filteredReviews.length; i++) {
      await filteredReviews[i].populate("user", "name email");
      await filteredReviews[i].populate("mentor", "name");
    }
    
    if (filteredReviews.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No reviews found for this mentor",
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      count: filteredReviews.length,
      data: filteredReviews
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
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
