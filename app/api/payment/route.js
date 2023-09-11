// pages/api/razorpay.js
require("dotenv").config();
const Razorpay = require("razorpay");
const shortid = require("shortid");
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const body = await req.json();

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  try {
    let paymentDetails = await instance.payments.fetch(body.paymentId);
    console.log(paymentDetails);
    return NextResponse.json({ msg: "success" });
  } catch (err) {
    console.log(err);
    return NextResponse.status(400).json(err);
  }
}
