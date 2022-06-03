import Env from '@ioc:Adonis/Core/Env'
import fetch from "node-fetch"

const base = "https://api-m.sandbox.paypal.com";

export default class PaypalsController {
    async create_order ({ response }) {
      //cria um novo order
      const order = await this.createOrder();
      response.json(order);
    }

    async captureOrder ({ request, response }) {
        const { orderID } = request.params;
        const captureData = await this.capturePayment(orderID);
        response.json(captureData);
    }

    async createOrder() {
        const accessToken = await this.generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "USD",
                        value: "100.00",
                    },
                }, ],
            }),
        });
        const data = await response.json();
        return data;
    }
    
    async capturePayment(orderId) {
        const accessToken = await this.generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        const response = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        return data;
    }
    
    async generateAccessToken() {
console.log('-------- ID CLIENTE:'+Env.get('CLIENT_ID') )
        const auth = Buffer.from(Env.get('CLIENT_ID') + ":" + Env.get('APP_SECRET')).toString("base64")
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "post",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await response.json();
        return data.access_token;
    }

}
