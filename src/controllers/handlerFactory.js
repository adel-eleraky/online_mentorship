import sendResponse from "./../utils/sendResponse.js";
import { validationResult } from "express-validator";
import ApiFeatures from "./../utils/apiFeatures.js";

const getAll = (Model) => async (req, res) => {
    try {
        let filter = {};
        if (req.params.roomId) filter = { room: req.params.roomId };

        const features = new ApiFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const docs = await features.query;

        sendResponse(res, 200, {
            result: docs.length,
            data: { docs }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Something went wrong", error: error.message });
    }
};

const getOne = (Model, popOptions) => async (req, res) => {
    try {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);

        const doc = await query;
        if (!doc) {
            return res.status(404).json({ status: "fail", message: "No document found with this ID" });
        }

        sendResponse(res, 200, {
            status: "success",
            data: { doc }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Something went wrong", error: error.message });
    }
};

const deleteOne = (Model) => async (req, res) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).json({ status: "fail", message: "No document found with this ID" });
        }

        sendResponse(res, 204, {
            status: "success",
            message: "Document deleted successfully",
            data: null
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Something went wrong", error: error.message });
    }
};

const createOne = (Model) => async (req, res) => {
    try {
        const newDoc = await Model.create(req.body);

        sendResponse(res, 201, {
            status: "success",
            message: "New document created successfully",
            data: { newDoc }
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: "Invalid data", error: error.message });
    }
};

const updateOne = (Model) => async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "fail", message: "Validation errors", errors: errors.array() });
        }

        const updateData = req.updateData || req.body;
        const updatedDoc = await Model.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedDoc) {
            return res.status(404).json({ status: "fail", message: "No document found with this ID" });
        }

        sendResponse(res, 200, {
            status: "success",
            message: "Document updated successfully",
            data: { updatedDoc }
        });
    } catch (error) {
        res.status(400).json({ status: "fail", message: "Invalid update data", error: error.message });
    }
};

export { getAll, getOne, deleteOne, createOne, updateOne };
