import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./apiIntercepters";


export const getRecentClients = async (notificationToken: string) => {
    try {
        const response = await api.post(`/user/notification-token`, { notificationToken });
        return response.data
    } catch (error: any) {
        console.error('Error getting companies:', error);
        throw new Error(error.message);
    }
};
const TOKEN_STORAGE_KEY = '@last_sent_fcm_token';

export const sendExpoTokenToBackend = async (
    notificationToken: string
) => {
    console.log("notificationToken",notificationToken)
    try {
        const lastSentToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY)

        if (notificationToken === lastSentToken) {
            // console.log('Token and user unchanged, skipping backend fcm token update');
            return;
        }

        const endpointUrl = `/user/notification-token`;
        const response = await api.post(endpointUrl, { notificationToken });
        console.log("FCM token sent with status", response.status);

        AsyncStorage.setItem(TOKEN_STORAGE_KEY, notificationToken)
        return response;
    } catch (error) {
        console.error("Error in token management:", error);
    }
};