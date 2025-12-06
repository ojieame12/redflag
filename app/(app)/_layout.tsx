
import { Tabs } from 'expo-router';
import { Home, Search, Receipt, User } from 'lucide-react-native';

export default function AppLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF5A5F',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#EBEBEB',
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(discover)"
                options={{
                    title: 'Discover',
                    tabBarIcon: ({ color }) => <Search size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(receipts)"
                options={{
                    title: 'Receipts',
                    tabBarIcon: ({ color }) => <Receipt size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
