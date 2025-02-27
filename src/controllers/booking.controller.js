import Rooms from "./../models/rooms.model"; 
import User from "./../models/user.model";
import Stripe from 'stripe';
import Booking from "./../models/booking.model";
import sendResponse from "./../utils/sendResponse";
import factory from "./handlerFactory";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Rooms.findById(roomId);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/my-bookings?alert=booking`,
            cancel_url: `${req.protocol}://${req.get('host')}/room/${room.slug}`,
            customer_email: req.user.email,
            client_reference_id: roomId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: room.price * 100,
                        product_data: {
                            name: `${room.name} Room`,
                            description: room.summary,
                        },
                    },
                    quantity: 1
                }
            ],
            mode: 'payment'
        });

        sendResponse(res, 200, { data: { session } });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const createBooking = async (session) => {
    try {
        const room = session.client_reference_id;
        const user = await User.findOne({ email: session.customer_email });

        if (!user) {
            console.warn(`User with email ${session.customer_email} not found for booking.`);
            return;
        }

        const price = session.amount_total / 100;
        await Booking.create({ room, user: user.id, price });

    } catch (error) {
        console.error("Booking creation failed:", error);
    }
};

const webhookCheckout = (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];
        let event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            createBooking(event.data.object);
        }

        res.status(200).json({ received: true });

    } catch (err) {
        console.error("Webhook error:", err);
        res.status(400).json({ success: false, message: `Webhook error: ${err.message}` });
    }
};

const getAllBookings = factory.getAll(Booking);

export { getCheckoutSession, webhookCheckout, getAllBookings };
