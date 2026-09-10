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
            merchantInvoiceNumber: "Inv0124"
        })
    });

    const bkashUrlResult = await bkashUrlResponse.json()

    console.log(bkashUrlResult);

    return bkashUrlResult
}



const bookAppoinmentCallback = async () => {

}












export const AppoinmentService = {
    bookAppoinment,
    bookAppoinmentCallback
}