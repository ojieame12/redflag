
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, BookOpen } from 'lucide-react-native';

const TOPICS = [
    {
        id: 'love-bombing',
        icon: '💣',
        title: 'Love Bombing',
        description: 'Overwhelming affection and attention used to manipulate.',
        content: `Love bombing is an attempt to influence a person by demonstrations of attention and affection. It can be used in different ways and for either positive or negative purposes. Psychologists have identified love bombing as a possible part of a cycle of abuse and have warned against it. It has also been described as psychological manipulation capable of creating a feeling of unity within a group against a society perceived as hostile.\n\nSigns include:\n• Excessive compliments\n• Constant communication\n• Rushing the relationship\n• Grandiose gifts\n• demanding 100% of your time`
    },
    {
        id: 'gaslighting',
        icon: '🕯️',
        title: 'Gaslighting',
        description: 'Psychological manipulation to make you question your sanity.',
        content: `Gaslighting is a colloquialism, loosely defined as making someone question their own reality. The term is also used in clinical and psychological literature. \n\nSigns include:\n• Denial of events that happened\n• Accusing you of being "crazy" or "sensitive"\n• Trivializing your feelings\n• "I never said that"`
    },
    {
        id: 'breadcrumbing',
        icon: '🍞',
        title: 'Breadcrumbing',
        description: 'Leading someone on with sporadic attention.',
        content: `Breadcrumbing is the act of sending out flirtatious, but non-committal social signals (i.e. "breadcrumbs") in order to lure a romantic partner in without expending much effort. It represents a form of manipulation where the abuser feeds the victim just enough attention to keep them interested.`
    },
    {
        id: 'negging',
        icon: '🔻',
        title: 'Negging',
        description: 'Backhanded compliments designed to undermine confidence.',
        content: `Negging is an act of emotional manipulation whereby a person makes a deliberate backhanded compliment or otherwise flirtatious remark to another person to undermine their confidence and increase their need of the manipulator's approval.`
    },
    {
        id: 'stonewalling',
        icon: '🧱',
        title: 'Stonewalling',
        description: 'Refusing to communicate or cooperate.',
        content: `Stonewalling is a persistent refusal to communicate or to express emotions. It is a common defense mechanism in situations of extreme conflict.`
    }
];

export default function DiscoverScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-6 py-4 border-b border-gray-100">
                <Text className="text-3xl font-bold text-airbnb-black">Discover</Text>
                <Text className="text-airbnb-foggy text-base mt-1">Learn the language of red flags.</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                <View className="bg-red-50 p-6 rounded-2xl mb-8 border border-red-100">
                    <Text className="text-airbnb-red font-bold text-sm uppercase mb-2 tracking-wider">Featured Article</Text>
                    <Text className="text-2xl font-bold text-airbnb-black mb-2">Why do we ignore Red Flags?</Text>
                    <Text className="text-airbnb-black leading-6 mb-4">
                        "When you look at someone through rose-colored glasses, all the red flags just look like flags." — Wanda
                    </Text>
                    <TouchableOpacity
                        className="bg-white self-start px-4 py-2 rounded-full border border-red-100"
                        onPress={() => router.push({ pathname: '/(discover)/[id]', params: { id: 'rose-colored' } })}
                    >
                        <Text className="font-bold text-airbnb-red">Read More</Text>
                    </TouchableOpacity>
                </View>

                <Text className="font-bold text-xl text-airbnb-black mb-4">Dictionary</Text>

                <View className="gap-4 pb-20">
                    {TOPICS.map((topic) => (
                        <TouchableOpacity
                            key={topic.id}
                            className="flex-row items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                            onPress={() => router.push({
                                pathname: '/(discover)/[id]',
                                params: { id: topic.id, title: topic.title, text: topic.content, icon: topic.icon }
                            })}
                        >
                            <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mr-4">
                                <Text className="text-2xl">{topic.icon}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="font-bold text-lg text-airbnb-black">{topic.title}</Text>
                                <Text className="text-airbnb-foggy text-sm leading-4" numberOfLines={2}>{topic.description}</Text>
                            </View>
                            <ChevronRight size={20} color="#B0B0B0" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
