import { api } from "./apiIntercepters";

export const initiateCheckout = async (priceId:string) => {
    try {
      const response = await api.post(`/billing/checkout`, {plan_price_id:priceId});
      console.log(response.data)
        return response.data
    } catch (error) {
      console.error('Checkout failed:', error);
      return { success: false };
    }
  };