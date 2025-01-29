import React from 'react';
import { View, Text, Button, Alert, StyleSheet, ScrollView, ViewStyle, TextStyle } from 'react-native';

// Class to manage styles
class StyleManager {
    static getContainerStyle(): ViewStyle {
        return {
            flex: 1,
            paddingTop: 50,
            paddingHorizontal: 20,
            backgroundColor: '#f9f9f9',
        };
    }

    static getContactCardStyle(): ViewStyle {
        return {
            backgroundColor: '#fff',
            padding: 15,
            marginBottom: 15,
            borderRadius: 10,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
        };
    }

    static getContactNameStyle(): TextStyle {
        return {
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
        };
    }
}

// Class to handle actions
class EmergencyContactActions {
    static handleCall(number: string) {
        Alert.alert(`Calling ${number}`);
        // Note: To actually open the dialer, use `Linking.openURL` here.
    }
}

// Component for individual contact card
class EmergencyContactCard extends React.PureComponent<{
    name: string;
    number: string;
}> {
    render() {
        const { name, number } = this.props;
        return (
            <View style={StyleManager.getContactCardStyle()}>
                <Text style={StyleManager.getContactNameStyle()}>{name}</Text>
                <Button
                    title={`Call ${number}`}
                    onPress={() => EmergencyContactActions.handleCall(number)}
                />
            </View>
        );
    }
}

// Main screen component
export default class EmergencyContactsScreen extends React.Component {
    private contacts = [
        { name: "Ambulance", number: "1122" },
        { name: "Police", number: "15" },
        { name: "Fire Department", number: "16" },
        { name: "Women Safety", number: "1043" },
    ];

    render() {
        return (
            <ScrollView style={StyleManager.getContainerStyle()}>
                {this.contacts.map((contact, index) => (
                    <EmergencyContactCard
                        key={index}
                        name={contact.name}
                        number={contact.number}
                    />
                ))}
            </ScrollView>
        );
    }
}
