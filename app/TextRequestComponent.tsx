import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from './MainStackParamList';
import { Picker } from '@react-native-picker/picker';

// Utility class to encapsulate API-related logic
class FirstAidService {
    private apiKey: string;
    private apiEndpoint: string;

    constructor() {
        this.apiKey = Constants.expoConfig?.extra?.GROQ_API_SECRET_KEY || 'your-fallback-api-key';
        this.apiEndpoint = Constants.expoConfig?.extra?.GROQ_API_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions';
    }

    // Method to check if API key and endpoint are valid
    validateApiConfig(): boolean {
        return Boolean(this.apiKey && this.apiEndpoint);
    }

    // Method to fetch first aid instructions
    async fetchInstructions(condition: string): Promise<string> {
        const requestBody = {
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. You provide first aid instructions based on medical conditions.',
                },
                {
                    role: 'user',
                    content: `Provide first aid instructions for the condition: ${condition}.`,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_completion_tokens: 1024,
            top_p: 1,
            stop: null,
            stream: false,
        };

        const response = await axios.post(this.apiEndpoint, requestBody, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    }
}

// Main Component
export default function ConditionScreen() {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCondition, setSelectedCondition] = useState<string>('');
    const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'ConditionScreen'>>();

    const firstAidService = new FirstAidService();

    const handleTextRequest = async () => {
        if (!selectedCondition) {
            Alert.alert('Error', 'Please select a condition.');
            return;
        }

        if (!firstAidService.validateApiConfig()) {
            Alert.alert('Error', 'API key or endpoint is missing.');
            return;
        }

        setLoading(true);
        try {
            const instructions = await firstAidService.fetchInstructions(selectedCondition);
            navigation.navigate('ResponseScreen', { response: instructions });
        } catch (error: any) {
            console.error('Error occurred:', error);
            Alert.alert('Error', `Failed to fetch instructions. Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Condition for First Aid Instructions</Text>

            <Picker
                selectedValue={selectedCondition}
                onValueChange={(itemValue) => setSelectedCondition(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select a condition" value="" />
                <Picker.Item label="Burns" value="Burns" />
                <Picker.Item label="Cuts" value="Cuts" />
                <Picker.Item label="Fractures" value="Fractures" />
                <Picker.Item label="Poisoning" value="Poisoning" />
                <Picker.Item label="Heart Attack" value="Heart Attack" />
                <Picker.Item label="Stroke" value="Stroke" />
                <Picker.Item label="Asthma" value="Asthma" />
                <Picker.Item label="Choking" value="Choking" />
                <Picker.Item label="Drowning" value="Drowning" />
                <Picker.Item label="Hypothermia" value="Hypothermia" />
                <Picker.Item label="Severe Allergic Reaction" value="Severe Allergic Reaction" />
            </Picker>

            <TouchableOpacity
                style={styles.button}
                onPress={handleTextRequest}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Get First Aid Instructions</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#17BEBB" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#FF4B4B',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 10,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
