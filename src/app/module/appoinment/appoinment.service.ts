import config from "../../config"
import { getBkashIdToken } from "../../lib/bKash"




const bookAppoinment = async () => {

    const bkashIdToken = await getBkashIdToken()


    const bkashUrlResponse = await fetch(`${config.bkash_base_url}/tokenized/checkout/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: bkashIdToken,
            "x-app-key": config.bkash_app_key
        },
        body: JSON.stringify({
            mode: "0011",
            payerReference: "01723888888",
            callbackURL: `${config.bKash_callback_url}/appoinment/book-appoinment/payment/callback`,
            amount: "120",
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: "Inv0001"
        })
    });

    const bkashUrlResult = await bkashUrlResponse.json()
    return bkashUrlResult
}



const bookAppoinmentCallback = async (query: Record<string, any>) => {

    const bkashIdToken = await getBkashIdToken()
    const paymentID = query.paymentID
    const status = query.status

    if (!bkashIdToken) {
        throw new Error("No Bkash Access Token Found!")
    }
    if (!paymentID) {
        throw new Error("Payment ID Missing")
    }
    if (!status) {
        throw new Error("Payment Status Missing")
    }



    const executePaymenResponse = await fetch(`${config.bkash_base_url}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            authorization: bkashIdToken,
            "x-app-key": config.bkash_app_key
        },
        body: JSON.stringify({ paymentID })
    });

    const executePaymentResult = await executePaymenResponse.json()

    if (status === 'success') {
        return {
            executePaymentResult,
            redirectUrl: `${config.frontend_url}/dashboard/my-appoinments?status=success`
        }
    }
    if (status === 'failure') {
        return {
            executePaymentResult,
            redirectUrl: `${config.frontend_url}/dashboard/my-appoinments?status=failure`
        }
    }
    if (status === 'cancel') {
        return {
            executePaymentResult,
            redirectUrl: `${config.frontend_url}/dashboard/my-appoinments?status=cancel`
        }
    }


    return {
        executePaymentResult,
        redirectUrl: `${config.frontend_url}/dashboard/my-appoinments`
    }
}












export const AppoinmentService = {
    bookAppoinment,
    bookAppoinmentCallback
}