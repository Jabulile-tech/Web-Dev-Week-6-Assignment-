require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

app.post("/checkout", async (req, res) => {
    const { items, total } = req.body;
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total * 100, // Convert to cents
            currency: "zar",
            description: "Gamede's Fried Chicken Order",
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: String,
    items: Array,
    total: Number,
    email: String,
    status: { type: String, default: "Pending" } // Tracks order progress
});

const Order = mongoose.model("Order", orderSchema);


app.get("/order/:id", async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.json({ status: order.status });
    } else {
        res.status(404).json({ error: "Order not found!" });
    }
});
function trackOrder(orderId) {
    fetch(`http://localhost:5000/order/${orderId}`)
        .then(response => response.json())
        .then(data => {
            alert(`Order Status: ${data.status}`);
        });
}
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post("/order", async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();

    const emailTemplate = `
        <html>
        <body>
        <h1>Gamede's Fried Chicken Order Confirmation</h1>
        <p>Thank you for ordering! Your total is <strong>R${req.body.total}</strong>.</p>
        <p>Order ID: <strong>${newOrder._id}</strong></p>
        <p>Track your order <a href="http://localhost:5000/order/${newOrder._id}">here</a>.</p>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: req.body.email,
        subject: "Order Confirmation - Gamede's Fried Chicken",
        html: emailTemplate
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    res.json({ message: "Order placed successfully! Email sent!" });
});