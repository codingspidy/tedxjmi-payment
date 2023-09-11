'use client'

import Script from 'next/script';
import React, { useState } from 'react'


const Form = () => {
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false);


    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const makePayment = async () => {
        setLoading(true)
        const res = await initializeRazorpay();

        if (!res) {
            alert("Razorpay SDK Failed to load");
            return;
        }
        setLoading(false)
        setCustomerName('')
        setEmail('')
        setPhone('')

        // Make API call to the serverless API
        const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
            t.json()
        );
        console.log(data);
        var options = {
            key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
            name: "TEDxJMI",
            currency: data.currency,
            amount: data.amount,
            order_id: data.id,
            description: "Thankyou for joining us.",
            // image: TedxLogo,
            handler: function (response) {
                // Validate payment at server - using webhooks is a better idea.
                let data = {
                    name: customerName,
                    email,
                }
                fetch('https://admin.tedxjmi.org/api/book', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then((res) => {
                    if (res.status === 200) {
                        setLoading(false);
                        console.log('Response succeeded!')
                    }
                })
                // console.log(response);
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature);
            },
            prefill: {
                name: customerName,
                email: email,
                contact: phone,
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true);
        console.log('Sending');
        let data = {
            customerName,
            email,
        }
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => {
            console.log('Response received')
            if (res.status === 200) {
                setLoading(false);
                console.log('Response succeeded!')
                setCustomerName('')
                setEmail('')
            }
        })
    }

    return (
        <div className=''>
            <h3 className='text-primary md:text-4xl text-3xl font-semibold mb-1'>Registration</h3>
            <p className='text-[#444444] text-lg font-medium mb-5'>Please fill below details before proceeding for payment!</p>
            <div>
                <div className='mb-3 flex flex-col lg:flex-row gap-3'>
                    <input
                    required
                        className='placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 px-4 shadow-sm focus:outline-none focus:ring-1 h-12'
                        placeholder='Your Name'
                        type='text'
                        id='firstName'
                        name='firstName'
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>
                <div className='mb-3'>
                    <input
                    required
                        className='placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 px-4 shadow-sm focus:outline-none focus:ring-1 h-12'
                        placeholder='Email'
                        type='email'
                        id='email'
                        name='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mb-3'>
                    <input
                        required
                        className='placeholder:text-slate-400 block w-full border border-slate-300 rounded-md py-2 px-4 shadow-sm focus:outline-none focus:ring-1 h-12'
                        placeholder='Phone'
                        type='text'
                        id='phone'
                        name='phone'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <Script
                    id="razorpay-checkout-js"
                    src="https://checkout.razorpay.com/v1/checkout.js"
                />
                <div className='text-center mb-3'>
                    <button onClick={makePayment} className='bg-black text-white px-12 rounded-full py-3 flex items-center justify-center'> { /* onClcik={handleContact} disabled={loading} */}
                        {loading && <span className='spinner-loader mr-2'></span>}
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form
