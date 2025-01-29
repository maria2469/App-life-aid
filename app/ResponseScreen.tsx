// Utility class to handle response parsing and formatting
class ResponseParser {
    static parseResponse(response: string): any {
        try {
            return response ? JSON.parse(response) : null;
        } catch (error) {
            return response; // If parsing fails, return raw response
        }
    }

    static formatInstructions(content: string): string[] {
        return content.split('\n').filter((line: string) => line.trim() !== '');
    }

    static isImageResponse(parsedResponse: any): boolean {
        return !!parsedResponse?.imageUrl;
    }

    static isTextResponse(parsedResponse: any): boolean {
        return typeof parsedResponse === 'string';
    }

    static isChoiceResponse(parsedResponse: any): boolean {
        return !!parsedResponse?.choices && Array.isArray(parsedResponse.choices);
    }
}

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from './MainStackParamList'; // Update path accordingly

type ResponseScreenRouteProp = RouteProp<MainStackParamList, 'ResponseScreen'>;

const ResponseScreen = () => {
    const route = useRoute<ResponseScreenRouteProp>();
    const { response } = route.params;

    // Log the response to check if it's received properly
    console.log('Received Response:', response);

    // Parse the response using the ResponseParser utility
    const parsedResponse = ResponseParser.parseResponse(response);

    // Render logic encapsulated in a function
    const renderResponse = () => {
        if (!parsedResponse) {
            return <Text style={styles.noDataText}>No instructions available.</Text>;
        }

        if (ResponseParser.isTextResponse(parsedResponse)) {
            return <Text style={styles.responseText}>{parsedResponse}</Text>;
        }

        if (ResponseParser.isImageResponse(parsedResponse)) {
            return (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: parsedResponse.imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            );
        }

        if (ResponseParser.isChoiceResponse(parsedResponse)) {
            const content = parsedResponse.choices[0].message.content;
            const instructions = ResponseParser.formatInstructions(content);

            return (
                <View style={styles.contentContainer}>
                    {instructions.map((line, index) => (
                        <Text key={index} style={styles.responseText}>
                            • <Text style={styles.pointText}>{line.trim()}</Text>
                        </Text>
                    ))}
                </View>
            );
        }

        return <Text style={styles.responseText}>Unsupported response format.</Text>;
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>First Aid Instructions</Text>
            {renderResponse()}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF4B4B',
        marginBottom: 15,
        textAlign: 'center',
    },
    responseText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    pointText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginLeft: 10, // Indent the bullet point
    },
    noDataText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    contentContainer: {
        marginTop: 10,
    },
    imageContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
});

export default ResponseScreen;
