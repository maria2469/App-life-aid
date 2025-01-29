import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from './MainStackParamList';
import axios from 'axios';

type ImageRequestNavigationProp = StackNavigationProp<MainStackParamList, 'ImageRequestComponent'>;

class ImageProcessor {
    static async getImageBase64(uri: string): Promise<string> {
        try {
            if (Platform.OS === 'web') {
                const response = await fetch(uri);
                const blob = await response.blob();
                const reader = new FileReader();

                return new Promise((resolve, reject) => {
                    reader.onloadend = () => resolve((reader.result as string)?.split(',')[1] || '');
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } else {
                return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            }
        } catch {
            return '';
        }
    }
}

class ApiService {
    private apiKey: string;
    private endpoint: string;

    constructor(apiKey: string, endpoint: string) {
        this.apiKey = apiKey;
        this.endpoint = endpoint;
    }

    async fetchImageAnalysis(base64Image: string) {
        if (!this.apiKey || !this.endpoint) {
            throw new Error('API key or endpoint is missing.');
        }

        const requestBody = {
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'Analyze this image and give first aid instructions according to it, if needed.' },
                        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
                    ],
                },
            ],
            model: 'llama-3.2-11b-vision-preview',
        };

        const response = await axios.post(this.endpoint, requestBody, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    }
}

export default function ImageRequestComponent() {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigation = useNavigation<ImageRequestNavigationProp>();

    const GROQ_API_KEY = Constants.expoConfig?.extra?.GROQ_API_KEY;
    const GROQ_API_ENDPOINT = Constants.expoConfig?.extra?.GROQ_API_ENDPOINT;

    const apiService = new ApiService(GROQ_API_KEY!, GROQ_API_ENDPOINT!);

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
            if (cameraPermission.status !== 'granted') {
                Alert.alert('Permission Denied', 'Camera permission is required.');
            }
        };
        requestPermissions();
    }, []);

    const handleImageSelection = async () => {
        try {
            const response = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.5,
            });

            if (response.canceled || !response.assets?.[0]?.uri) {
                return;
            }

            const imageUri = response.assets[0].uri;
            setSelectedImage(imageUri);
            await analyzeImage(imageUri);
        } catch {
            Alert.alert('Error', 'Failed to capture the image. Please try again.');
        }
    };

    const analyzeImage = async (imageUri: string) => {
        setLoading(true);
        try {
            const base64Image = await ImageProcessor.getImageBase64(imageUri);
            if (!base64Image) {
                throw new Error('Failed to convert image to base64.');
            }

            const analysisResult = await apiService.fetchImageAnalysis(base64Image);
            navigation.navigate('ResponseScreen', { response: JSON.stringify(analysisResult) });
        } catch (error: any) {
            Alert.alert('Error', `Failed to fetch instructions: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Upload and Analyze Image</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleImageSelection}>
                <Text style={styles.buttonText}>Capture Image</Text>
            </TouchableOpacity>

            {selectedImage && (
                <View style={styles.imagePreview}>
                    <Image source={{ uri: selectedImage }} style={styles.image} />
                </View>
            )}

            {loading && <ActivityIndicator size="large" color="#17BEBB" style={styles.loader} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
    button: { backgroundColor: '#FF4B4B', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    imagePreview: { alignItems: 'center', marginVertical: 20 },
    image: { width: 200, height: 200, borderRadius: 10 },
    loader: { marginTop: 20 },
});
