import { api } from "./apiIntercepters";

export const initiateCheckout = async (priceId: string) => {
  try {
    const response = await api.post(`/billing/checkout`, { plan_price_id: priceId });
    return response.data
  } catch (error) {
    console.error('Checkout failed:', error);
    return { success: false };
  }
};

export const getCurrentPlan = async () => {
  try {
    const response = await api.get(`/billing/me`);
    return response.data
  } catch (error: any) {
    console.error('Error getting billing plan:', error);
    throw new Error(error.message);
  }
};