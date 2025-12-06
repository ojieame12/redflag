
import Purchases, {
    PurchasesOffering,
    CustomerInfo,
    PurchasesPackage,
    LOG_LEVEL
} from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEYS = {
    ios: 'test_MwMMrAefiLqCwtJjbxwyJUpeTJa', // User provided key
    android: 'test_MwMMrAefiLqCwtJjbxwyJUpeTJa', // Assuming same key for now or placeholder
};

// The entitlement ID defined in RevenueCat dashboard
export const ENTITLEMENT_ID = 'REDFLAG Pro';

export const initializePurchases = async (userId?: string) => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);

    if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: API_KEYS.ios, appUserID: userId });
    } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: API_KEYS.android, appUserID: userId });
    }
};

export const getOfferings = async (): Promise<PurchasesOffering | null> => {
    try {
        const offerings = await Purchases.getOfferings();
        return offerings.current;
    } catch (e) {
        console.error("Error fetching offerings", e);
        return null;
    }
};

export const purchasePackage = async (pkg: PurchasesPackage): Promise<CustomerInfo> => {
    try {
        const { customerInfo } = await Purchases.purchasePackage(pkg);
        return customerInfo;
    } catch (e: any) {
        if (!e.userCancelled) {
            console.error("Purchase error", e);
            throw e;
        }
        throw e;
    }
};

export const restorePurchases = async (): Promise<CustomerInfo> => {
    try {
        return await Purchases.restorePurchases();
    } catch (e) {
        console.error("Restore error", e);
        throw e;
    }
};

export const checkPremiumAccess = (customerInfo: CustomerInfo): boolean => {
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
};
