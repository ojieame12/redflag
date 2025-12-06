
import { View, Text, TouchableOpacity, Share } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { forwardRef, useMemo, useCallback } from 'react';
import { Copy, Instagram, Share2, Download, MessageCircle } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

interface ShareSheetProps {
    onClose?: () => void;
    contentToShare?: string; // URL or Message
}

const ShareSheet = forwardRef<BottomSheet, ShareSheetProps>(({ onClose, contentToShare }, ref) => {
    const snapPoints = useMemo(() => ['40%'], []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        []
    );

    const handleCopy = async () => {
        if (contentToShare) {
            await Clipboard.setStringAsync(contentToShare);
            Toast.show({
                type: 'success',
                text1: 'Copied to clipboard',
            });
            onClose?.();
        }
    };

    const handleSystemShare = async () => {
        if (contentToShare) {
            try {
                await Share.share({
                    message: contentToShare,
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            onClose={onClose}
        >
            <BottomSheetView className="flex-1 px-6 pt-4">
                <Text className="text-xl font-bold text-center mb-6 text-airbnb-black">Share Result</Text>

                <View className="flex-row flex-wrap justify-between gap-y-6">
                    <ShareOption
                        icon={<Instagram size={28} color="#C13584" />}
                        label="Instagram"
                        onPress={() => { /* TODO: Implement sticker share */ handleSystemShare() }}
                    />
                    <ShareOption
                        icon={<MessageCircle size={28} color="#25D366" />}
                        label="WhatsApp"
                        onPress={handleSystemShare}
                    />
                    <ShareOption
                        icon={<Copy size={28} color="#484848" />}
                        label="Copy Link"
                        onPress={handleCopy}
                    />
                    <ShareOption
                        icon={<Share2 size={28} color="#484848" />}
                        label="More"
                        onPress={handleSystemShare}
                    />
                </View>

                <View className="mt-8 pt-6 border-t border-gray-100">
                    <TouchableOpacity
                        className="flex-row items-center justify-center p-4 bg-gray-50 rounded-xl"
                        onPress={() => { /* TODO: Save image logic */ }}
                    >
                        <Download size={20} color="#484848" />
                        <Text className="font-bold text-airbnb-black ml-2">Save Image</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
});

function ShareOption({ icon, label, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress} className="items-center w-[22%]">
            <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center mb-2">
                {icon}
            </View>
            <Text className="text-xs font-medium text-airbnb-foggy">{label}</Text>
        </TouchableOpacity>
    );
}

export default ShareSheet;
