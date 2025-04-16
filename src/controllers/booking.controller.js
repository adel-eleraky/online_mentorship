// // import Rooms from "./../models/rooms.model.js"; 
// import Session from "./../models/session.model.js";
// import User from "./../models/user.model.js";
// import Room from "../models/rooms.model.js"
// import Stripe from 'stripe';
// import Booking from "./../models/booking.model.js";
// import sendResponse from "./../utils/sendResponse.js";
// import * as factory from "./handlerFactory.js";
// import { notify } from "./notification.controller.js";
// import oneToOneSessionModel from "../models/oneToOneSession.model.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const getCheckoutSession = async (req, res) => {
//     try {
//         const { sessionId } = req.params;
//         const session_data = await Session.findById(sessionId);

//         if (!session_data) {
//             return res.status(404).json({ success: false, message: "Session not found" });
//         }

//         const user = await User.findById(req.user.id);

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             success_url: `http://localhost:5173/success`,
//             cancel_url: `http://localhost:5173/cancel`,
//             customer_email: user.email,
//             client_reference_id: sessionId,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         unit_amount: session_data.price * 100,
//                         product_data: {
//                             name: `${session_data.title} session`,
//                             description: session_data.description,
//                         },
//                     },
//                     quantity: 1
//                 }
//             ],
//             mode: 'payment'
//         });

//         return res.status(201).json({
//             status: "success",
//             data: session
//         })
//         // sendResponse(res, 200, { data: { session } });
//     } catch (error) {
//         console.error("Error creating checkout session:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// const getCheckoutOneToOneSession = async (req, res) => {
//     try {
//         const { sessionId } = req.params;
//         const session_data = await oneToOneSessionModel.findById(sessionId);

//         if (!session_data) {
//             return res.status(404).json({ success: false, message: "Session not found" });
//         }

//         const user = await User.findById(req.user.id);

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             success_url: `http://localhost:5173/success`,
//             cancel_url: `http://localhost:5173/cancel`,
//             customer_email: user.email,
//             client_reference_id: sessionId,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         unit_amount: session_data.price * 100,
//                         product_data: {
//                             name: `${session_data.title} session`,
//                             description: session_data.description,
//                         },
//                     },
//                     quantity: 1
//                 }
//             ],
//             mode: 'payment'
//         });

//         return res.status(201).json({
//             status: "success",
//             data: session
//         })
//         // sendResponse(res, 200, { data: { session } });
//     } catch (error) {
//         console.error("Error creating checkout session:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };

// const createBooking = async (req, res) => {
//     try {

//         const session = await Session.findById(req.body.session)
//         if (!session) {
//             return res.status(404).json({
//                 status: "fail",
//                 message: "session not found"
//             })
//         }

//         const booking = await Booking.create({ session: session._id, user: req.user.id, price: session.price });

//         return res.status(201).json({
//             status: "success",
//             message: "session booked successfully",
//             data: booking
//         })

//     } catch (err) {
//         res.status(500).json({
//             status: "error",
//             message: "Something went wrong",
//             error: err.message
//         });
//     }
// }

// const updateBooking = async (session, req, res) => {
//     try {

//         const sessionId = session.client_reference_id;
//         const user = await User.findOne({ email: session.customer_email });

//         if (!user) {
//             console.warn(`User with email ${session.customer_email} not found for booking.`);
//             return;
//         }

//         // const booking = await Booking.find({session: sessionId , user: user._id})
//         // booking.paymentStatus = "paid"
//         // await booking.save()

//         const existBooking = await Booking.findOne({ session: sessionId , user: user._id })
//         if(existBooking) {
//             return;
//         }

//         const booking = await Booking.create({ session: sessionId, user: user._id, price: session.amount_total / 100 });


//         const sessionData = await Session.findById(sessionId).populate("mentor")
//         const userData = await User.findById(user._id)

//         const connectedUsers = req.app.get("connectedUsers")
//         const io = req.app.get("io")

//         await notify({
//             userId: sessionData.mentor._id,
//             message: `${userData.name} Booked your session ${sessionData.title}`,
//             type: "booking",
//             io,
//             connectedUsers
//         });
//         // access user to the chat room , after booking is paid
//         const room = await Room.findOneAndUpdate({ session: sessionId }, { $push: { members: user._id } }, { new: true })

//     } catch (error) {
//         console.error("Booking creation failed:", error);
//     }
// };

// const webhookCheckout = async (req, res) => {
//     try {
//         const signature = req.headers['stripe-signature'];
//         let event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

//         if (event.type === 'checkout.session.completed') {
//             // console.log(event.data.object)
//             await updateBooking(event.data.object, req, res);
//         }

//         res.status(200).json({ received: true });

//     } catch (err) {
//         console.error("Webhook error:", err);
//         res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
//     }
// };

// const getAllBookings = factory.getAll(Booking);

// export { getCheckoutSession, webhookCheckout, getAllBookings, createBooking, getCheckoutOneToOneSession };


import Session from "./../models/session.model.js";
import User from "./../models/user.model.js";
import Room from "../models/rooms.model.js";
import Stripe from 'stripe';
import Booking from "./../models/booking.model.js";
import sendResponse from "./../utils/sendResponse.js";
import * as factory from "./handlerFactory.js";
import { notify } from "./notification.controller.js";
import oneToOneSessionModel from "../models/oneToOneSession.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ========== Group Session Checkout ==========
const getCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session_data = await Session.findById(sessionId);

        if (!session_data) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        const user = await User.findById(req.user.id);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/cancel`,
            customer_email: user.email,
            client_reference_id: sessionId,
            metadata: {
                sessionType: 'group'
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: session_data.price * 100,
                        product_data: {
                            name: `${session_data.title} session`,
                            description: session_data.description,
                        },
                    },
                    quantity: 1
                }
            ],
            mode: 'payment'
        });

        return res.status(201).json({
            status: "success",
            data: session
        });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ========== One-to-One Session Checkout ==========
const getCheckoutOneToOneSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session_data = await oneToOneSessionModel.findById(sessionId);

        if (!session_data) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        const user = await User.findById(req.user.id);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/cancel`,
            customer_email: user.email,
            client_reference_id: sessionId,
            metadata: {
                sessionType: 'oneToOne'
            },
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: session_data.price * 100,
                        product_data: {
                            name: `${session_data.title} session`,
                            description: session_data.description,
                        },
                    },
                    quantity: 1
                }
            ],
            mode: 'payment'
        });

        return res.status(201).json({
            status: "success",
            data: session
        });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ========== Create Booking ==========
const createBooking = async (req, res) => {
    try {
        const session = await Session.findById(req.body.session);
        if (!session) {
            return res.status(404).json({
                status: "fail",
                message: "Session not found"
            });
        }

        const booking = await Booking.create({
            session: session._id,
            user: req.user.id,
            price: session.price
        });

        return res.status(201).json({
            status: "success",
            message: "Session booked successfully",
            data: booking
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
};

// ========== Update Booking on Payment ==========
const updateBooking = async (session, req, res) => {
    try {
        const sessionId = session.client_reference_id;
        const sessionType = session.metadata.sessionType;
        const user = await User.findOne({ email: session.customer_email });

        if (!user) {
            console.warn(`User with email ${session.customer_email} not found.`);
            return;
        }

        const sessionModel = sessionType === 'oneToOne' ? oneToOneSessionModel : Session;

        const existBooking = await Booking.findOne({ session: sessionId, user: user._id });
        if (existBooking) return;

        // Create a new booking
        const booking = await Booking.create({
            session: sessionId,
            user: user._id,
            price: session.amount_total / 100
        });

        // If one-to-one, mark paymentStatus as paid
        if (sessionType === 'oneToOne') {
            await oneToOneSessionModel.findByIdAndUpdate(
                sessionId,
                { paymentStatus: "paid" },
                { new: true }
            );
        }

        const sessionData = await sessionModel.findById(sessionId).populate("mentor");
        const userData = await User.findById(user._id);

        const connectedUsers = req.app.get("connectedUsers");
        const io = req.app.get("io");

        await notify({
            userId: sessionData.mentor._id,
            message: `${userData.name} booked your session "${sessionData.title}"`,
            type: "booking",
            io,
            connectedUsers
        });

        await Room.findOneAndUpdate(
            { session: sessionId },
            { $push: { members: user._id } },
            { new: true }
        );

    } catch (error) {
        console.error("Booking creation failed:", error);
    }
};


// ========== Stripe Webhook ==========
const webhookCheckout = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        const event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            await updateBooking(event.data.object, req, res);
        }

        res.status(200).json({ received: true });

    } catch (err) {
        console.error("Webhook error:", err);
        res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
    }
};

const getAllBookings = factory.getAll(Booking);

// ========== Exports ==========
export {
    getCheckoutSession,
    getCheckoutOneToOneSession,
    createBooking,
    webhookCheckout,
    getAllBookings
};
