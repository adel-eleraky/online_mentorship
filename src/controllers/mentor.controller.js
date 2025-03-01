import Mentor from "../models/mentor.model.js"
import * as bcrypt from 'bcrypt';


// GET all Mentors
export const getAllMentors = async (req, res) => {
    try {
        const mentors = await Mentor.find({}, { password: 0, __v: 0 });
        res.status(200).json({ status: "success", data: mentors });
    } catch (err) {
        res.status(500).json({ status: "fail", message: "Error fetching Mentors", error: err.message });
    }
};

export const getMentorById = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await Mentor.findById(id, { password: 0, __v: 0 });
        res.status(200).json({ status: "success", data: mentor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching Mentors", error: err.message });
    }
};

// Delete mentor by id
export const deleteMentor = async (req, res) => {
    try {
        const { id } = req.params;
        const mentor = await Mentor.findByIdAndDelete(id);

        if (!mentor) {
            return res.status(404).json({
                status: "fail",
                message: "Mentor not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Mentor deleted successfully",
            data: mentor,
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: "An error occurred while deleting the Mentor",
            error: err.message,
        });
    }
};

export const updateMentor = async (req, res) => {
    try {

        const { id } = req.user;

        const updatedMentor = await Mentor.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({
            status: "success",
            message: "Mentor updated successfully",
            data: updatedMentor
        });

    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: "An error occurred while updating the Mentor",
            error: err.message,
        });
    }
}

export const getLoggedInMentor = async (req, res) => {

    try {
        const mentor = await Mentor.findById(req.user.id, { password: 0, __v: 0 });
        res.status(200).json({ status: "success", data: mentor });
    } catch (err) {
        res.status(500).json({ status: "fail", message: "Error fetching Mentor", error: err.message });
    }
}

export const uploadProfileImage = async (req, res) => {
    try {

        let { id } = req.user

        const mentor = await Mentor.findById(id)
        mentor.image = req.file.filename

        await mentor.save()

        res.status(200).json({
            status: "success",
            message: "Photo uploaded successfully",
            data: mentor
        })
    } catch (err) {
        res.status(500).json({status: "fail", message: err.message })
    }
}


export const updateMentorPassword = async (req, res) => {

    try {

        let { id } = req.user
        let { newPassword } = req.body

        const password = await bcrypt.hash(newPassword, 8)
        const mentor = await Mentor.findByIdAndUpdate(id, { password }, { new: true })

        const objecMentor = mentor.toObject();
        delete objecMentor.password;

        return res.status(200).json({
            status: "success",
            message: "Password updated successfully",
            data: objecMentor
        })

    } catch (err) {
        return res.status(500).json({ status: "fail", message: err.message })
    }
}
