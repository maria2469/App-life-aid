import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainStackParamList } from './MainStackParamList'; // Update the path accordingly

type ConditionScreenNavigationProp = StackNavigationProp<MainStackParamList, 'ConditionScreen'>;

// Define a class for managing styles
class StyleManager {
    static getContainerStyle(): ViewStyle {
        return {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#f5f5f5',
        };
    }

    static getTitleStyle(): TextStyle {
        return {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#FF4B4B',
            marginBottom: 20,
        };
    }

    static getSubtitleStyle(): TextStyle {
        return {
            fontSize: 16,
            color: '#666',
            marginBottom: 40,
        };
    }

    static getButtonStyle(): ViewStyle {
        return {
            backgroundColor: '#FF4B4B',
            paddingVertical: 15,
            paddingHorizontal: 30,
            borderRadius: 8,
            marginVertical: 10,
        };
    }

    static getButtonTextStyle(): TextStyle {
        return {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        };
    }
}

// Define a Button component for reusability
class ActionButton extends React.PureComponent<{
    label: string;
    onPress: () => void;
}> {
    render() {
        const { label, onPress } = this.props;
        return (
            <TouchableOpacity style={StyleManager.getButtonStyle()} onPress={onPress}>
                <Text style={StyleManager.getButtonTextStyle()}>{label}</Text>
            </TouchableOpacity>
        );
    }
}

// Main screen component
export default function ConditionScreen() {
    const navigation = useNavigation<ConditionScreenNavigationProp>();

    return (
        <View style={StyleManager.getContainerStyle()}>
            <Text style={StyleManager.getTitleStyle()}>Life Aid</Text>
            <Text style={StyleManager.getSubtitleStyle()}>
                Save lives. First aid is for everyone, everywhere.
            </Text>

            <ActionButton
                label="Select Condition"
                onPress={() => navigation.navigate('TextRequestComponent')}
            />
            <ActionButton
                label="Upload Image"
                onPress={() => navigation.navigate('ImageRequestComponent')}
            />
        </View>
    );
}
