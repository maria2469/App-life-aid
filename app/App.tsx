import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainStackParamList } from './MainStackParamList';  // Param list for type safety

// Import the screen components
import ConditionScreen from './ConditionScreen';
import ResponseScreen from './ResponseScreen';
import HospitalsScreen from './HospitalsScreen';
import EmergencyContactsScreen from './EmergencyContactsScreen';
import HomeScreen from '.';  // New screen (example)

const Stack = createStackNavigator<MainStackParamList>();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="ConditionScreen" component={ConditionScreen} />
                <Stack.Screen name="ResponseScreen" component={ResponseScreen} />
                <Stack.Screen name="HospitalsScreen" component={HospitalsScreen} />
                <Stack.Screen name="EmergencyContactsScreen" component={EmergencyContactsScreen} />
                {/* Add other screens here */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
