import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

import headerImage from '../assets/images/HeaderImage.jpg'; // Corrected import path
import iconImage from '../assets/images/icon.jpg'; // Correct path for the icon

const Index = () => {
    const router = useRouter();

    const handleNavigateToCondition = () => {
        console.log('Navigating to ConditionScreen');
        try {
            router.push('/ConditionScreen'); // Navigate to ConditionScreen
        } catch (error) {
            console.error('Error navigating to ConditionScreen:', error);
        }
    };

    const handleNavigateToHospitals = () => {
        console.log('Navigating to HospitalsScreen');
        try {
            router.push('/HospitalsScreen'); // Navigate to HospitalsScreen
        } catch (error) {
            console.error('Error navigating to HospitalsScreen:', error);
        }
    };

    const handleNavigateToEmergencyContacts = () => {
        console.log('Navigating to EmergencyContactsScreen');
        try {
            router.push('/EmergencyContactsScreen'); // Navigate to EmergencyContactsScreen
        } catch (error) {
            console.error('Error navigating to EmergencyContactsScreen:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with background image */}
            <View style={styles.header}>
                <Image
                    source={headerImage} // Use the imported image
                    style={styles.headerImage}
                />
                {/* Icon positioned to the top-left */}
                <Image
                    source={iconImage} // Use the imported icon image
                    style={styles.icon}
                />
                <Text style={styles.title}>Life-Aid</Text>
                <Text style={styles.description}>
                    Save lives. First aid is for everyone, everywhere.
                </Text>
            </View>

            {/* Buttons for navigating */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNavigateToCondition}
                >
                    <Text style={styles.buttonText}>Let's save life!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNavigateToHospitals}
                >
                    <Text style={styles.buttonText}>Nearby Hospitals</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNavigateToEmergencyContacts}
                >
                    <Text style={styles.buttonText}>Emergency Numbers</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        width: '100%',
        height: 400, // Adjust height for full-screen background
        backgroundColor: '#FF4B4B',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    headerImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        width: '100%',
        opacity: 0.6, // Reduce opacity to overlay text
    },
    icon: {
        position: 'absolute',
        top: 20, // Position icon at the top
        left: 20, // Align to the left
        width: 60, // Increase size of the icon
        height: 60, // Increase size of the icon
        zIndex: 1, // Ensure it appears on top of the background

    },
    title: {
        fontSize: 48, // Increase title size
        fontWeight: 'bold',
        color: 'white',
        zIndex: 1,
        textAlign: 'center',
    },
    description: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
        zIndex: 1,
        marginHorizontal: 20,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#FF4B4B',
        paddingVertical: 12,
        marginVertical: 10,
        width: '80%',
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
