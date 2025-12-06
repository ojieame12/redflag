import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    loading?: boolean;
    className?: string;
}

import * as Haptics from 'expo-haptics';

export function Button({
    variant = 'primary',
    size = 'md',
    label,
    loading,
    className,
    disabled,
    onPress,
    ...props
}: ButtonProps) {

    const baseStyles = "rounded-full flex-row items-center justify-center";

    const variants = {
        primary: "bg-airbnb-red active:opacity-90",
        secondary: "bg-airbnb-black active:opacity-80",
        outline: "bg-transparent border border-gray-300 active:bg-gray-50",
        ghost: "bg-transparent active:bg-gray-100",
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4",
    };

    const textStyles = {
        primary: "text-white font-bold",
        secondary: "text-white font-bold",
        outline: "text-gray-900 font-semibold",
        ghost: "text-gray-900 font-medium",
    };

    const handlePress = async (e: any) => {
        if (process.env.EXPO_OS !== 'web') {
            await Haptics.selectionAsync();
        }
        onPress?.(e);
    };

    return (
        <TouchableOpacity
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                disabled && "opacity-50",
                className
            )}
            disabled={disabled || loading}
            onPress={handlePress}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? 'black' : 'white'} />
            ) : (
                <Text className={clsx("text-center", textStyles[variant])}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}
