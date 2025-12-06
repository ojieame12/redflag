import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Button } from '@/components/ui/Button';
import { Mic, Square, Play, RefreshCw } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';

interface AudioRecorderProps {
    onAnalysisTrigger: (base64Audio: string) => void;
    loading: boolean;
}

export default function AudioRecorder({ onAnalysisTrigger, loading }: AudioRecorderProps) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');

    async function startRecording() {
        try {
            if (permissionResponse?.status !== 'granted') {
                const { status } = await requestPermission();
                if (status !== 'granted') return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(recording);
            setRecordingStatus('recording');
        } catch (err) {
            Alert.alert('Failed to start recording', String(err));
        }
    }

    async function stopRecording() {
        if (!recording) return;
        setRecordingStatus('idle');
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setAudioUri(uri);
        setRecordingStatus('recorded');
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    }

    async function handleAnalyze() {
        if (!audioUri) return;
        try {
            const base64 = await FileSystem.readAsStringAsync(audioUri, { encoding: 'base64' });
            onAnalysisTrigger(base64);
        } catch (e) {
            Alert.alert("Error processing audio", "Could not prepare audio for analysis.");
        }
    }

    async function reset() {
        setAudioUri(null);
        setRecordingStatus('idle');
    }

    return (
        <View className="items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">

            {recordingStatus === 'idle' && (
                <TouchableOpacity
                    onPress={startRecording}
                    className="items-center justify-center"
                >
                    <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                        <Mic size={32} color="#FF5A5F" />
                    </View>
                    <Text className="font-bold text-airbnb-black text-lg">Tap to Record</Text>
                    <Text className="text-airbnb-foggy mt-1">Share your story or play a recording</Text>
                </TouchableOpacity>
            )}

            {recordingStatus === 'recording' && (
                <View className="items-center">
                    <View className="mb-6">
                        <Text className="text-red-500 font-bold animate-pulse text-lg">Recording...</Text>
                    </View>
                    <TouchableOpacity
                        onPress={stopRecording}
                        className="w-16 h-16 bg-airbnb-red rounded-full items-center justify-center shadow-lg"
                    >
                        <Square size={24} color="white" fill="white" />
                    </TouchableOpacity>
                </View>
            )}

            {recordingStatus === 'recorded' && (
                <View className="w-full">
                    <View className="flex-row items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <View className="bg-green-100 p-2 rounded-full">
                                <Play size={20} color="green" fill="green" />
                            </View>
                            <Text className="font-medium text-airbnb-black">Voice Note Ready</Text>
                        </View>
                        <TouchableOpacity onPress={reset}>
                            <RefreshCw size={20} color="#767676" />
                        </TouchableOpacity>
                    </View>

                    <Button
                        label={loading ? "Analyzing Audio..." : "Analyze Recording"}
                        onPress={handleAnalyze}
                        loading={loading}
                        className="w-full"
                    />
                </View>
            )}

        </View>
    );
}
