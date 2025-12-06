import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { QUIZ_QUESTIONS, calculateResult } from '@/data/quiz';
import { clsx } from 'clsx';
import * as SecureStore from 'expo-secure-store';
import { MotiView } from 'moti';

export default function QuizScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<('secure' | 'anxious' | 'dismissive' | 'fearful')[]>([]);

    const currentQuestion = QUIZ_QUESTIONS[currentIndex];
    const progress = ((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;

    const handleSelect = (style: 'secure' | 'anxious' | 'dismissive' | 'fearful') => {
        const newAnswers = [...answers, style];
        setAnswers(newAnswers);

        if (currentIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishQuiz(newAnswers);
        }
    };

    const finishQuiz = async (finalAnswers: any[]) => {
        const result = calculateResult(finalAnswers);
        await SecureStore.setItemAsync('attachment_style', result);
        router.replace({
            pathname: "/quiz/result",
            params: { style: result }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-gray-100 bg-white z-10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <ArrowLeft color="#484848" size={24} />
                </TouchableOpacity>
                <View className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <MotiView
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'timing', duration: 500 }}
                        className="h-full bg-airbnb-red rounded-full"
                    />
                </View>
                <Text className="ml-4 font-bold text-gray-400 font-mono">
                    {currentIndex + 1}/{QUIZ_QUESTIONS.length}
                </Text>
            </View>

            <View className="flex-1 justify-center p-6">
                <MotiView
                    key={currentIndex} // Re-animate on key change
                    from={{ opacity: 0, translateX: 50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    exit={{ opacity: 0, translateX: -50 }}
                    transition={{ type: 'timing', duration: 300 }}
                >
                    <Text className="text-3xl font-black text-airbnb-black mb-10 text-center leading-9">
                        {currentQuestion.text}
                    </Text>

                    <View className="gap-4">
                        {currentQuestion.options.map((option, idx) => (
                            <MotiView
                                key={idx}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: idx * 100 }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => handleSelect(option.style)}
                                    className="p-6 rounded-2xl border border-gray-100 bg-gray-50 active:bg-red-50 active:border-red-200"
                                >
                                    <Text className="text-lg text-airbnb-black font-semibold text-center">
                                        {option.text}
                                    </Text>
                                </TouchableOpacity>
                            </MotiView>
                        ))}
                    </View>
                </MotiView>
            </View>
        </SafeAreaView>
    );
}
