import { Platform } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';

const API_KEYS = {
    apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_KEY || 'appl_placeholder',
    google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_KEY || 'goog_placeholder',
};

class RevenueCatService {
    static async init() {
        if (Platform.OS === 'ios') {
            Purchases.configure({ apiKey: API_KEYS.apple });
        } else if (Platform.OS === 'android') {
            Purchases.configure({ apiKey: API_KEYS.google });
        }
    }

    static async getOfferings() {
        try {
            const offerings = await Purchases.getOfferings();
            return offerings.current;
        } catch (e) {
            console.log('Error fetching offerings', e);
            return null;
        }
    }

    static async purchasePackage(pack: PurchasesPackage) {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            return customerInfo;
        } catch (e: any) {
            if (!e.userCancelled) {
                console.log('Error purchasing package', e);
            }
            throw e;
        }
    }

    static async getCustomerInfo() {
        try {
            return await Purchases.getCustomerInfo();
        } catch (e) {
            return null;
        }
    }
}

export default RevenueCatService;
