// import Rooms from "./../models/rooms.model.js"; 
import Session from "./../models/session.model.js";
import User from "./../models/user.model.js";
import Stripe from 'stripe';
import Booking from "./../models/booking.model.js";
import sendResponse from "./../utils/sendResponse.js";
import factory from "./handlerFactory.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const session_data = await Session.findById(sessionId);

        if (!session_data) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        
        const user = await User.findById(req.user.id);
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/my-bookings?alert=booking`,
            cancel_url: `${req.protocol}://${req.get('host')}/sessions/${session_data._id}`,
            customer_email: user.email,
            client_reference_id: sessionId,
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
        })
        // sendResponse(res, 200, { data: { session } });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const createBooking = async (req, res) => {
    try{

        const session = await Session.findById(req.body.session)
        if(!session) {
            return res.status(404).json({
                status: "fail",
                message: "session not found"
            })
        }
        
        const booking = await Booking.create({ session: session._id, user: req.user.id, price: session.price });

        return res.status(201).json({
            status: "success",
            message: "session booked successfully",
            data: booking
        })

    }catch(err) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}

const updateBooking = async (session) => {
    try {
        const sessionId = session.client_reference_id;
        const user = await User.findOne({ email: session.customer_email });

        if (!user) {
            console.warn(`User with email ${session.customer_email} not found for booking.`);
            return;
        }

        const booking = await Booking.find({session: sessionId , user: user._id})

        booking.paymentStatus = "paid"
        await booking.save()

    } catch (error) {
        console.error("Booking creation failed:", error);
    }
};

const webhookCheckout = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        let event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            await updateBooking(event.data.object);
        }

        res.status(200).json({ received: true });

    } catch (err) {
        console.error("Webhook error:", err);
        res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
    }
};

const getAllBookings = factory.getAll(Booking);

export { getCheckoutSession, webhookCheckout, getAllBookings , createBooking };
