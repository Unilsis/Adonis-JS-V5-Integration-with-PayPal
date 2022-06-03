import Env from '@ioc:Adonis/Core/Env'
import fetch from "node-fetch"

const base = "https://api-m.sandbox.paypal.com"

export default class PaypalsController {

    async checkout ({ response }) {
      //cria um novo order
      const order = await this.createOrder()
      return response.status(200).json({ message: "Pagamento realizado com sucesso", data: order })
    }
    
    
    async createOrder() {
      const accessToken = await this.generateAccessToken()
      console.log('---------------------Token: '+`Bearer ${accessToken}`)
      const url = `${base}/v2/checkout/orders`
      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: "25.00",
              },
            },
          ],
        }),
      })
      const data = await response.json()
      return data
    }
    
    // gera um token de acesso
    async generateAccessToken() {
      const auth = Buffer.from(Env.get('PAYPAL_ID') + ":" + Env.get('PAYPAL_SECRET')).toString("base64")
      const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "post",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      })
      const data = await response.json()
      return data.access_token
    }

}
