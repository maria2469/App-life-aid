import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Linking,
} from "react-native";
import * as Location from "expo-location";
import axios, { AxiosError } from "axios";
import MapView, { Marker } from "react-native-maps";

// Hospital class representing individual hospital data
class Hospital {
    constructor(
        public name: string,
        public latitude: number,
        public longitude: number,
        public distance: number,
        public phone: string,
        public iconUrl: string
    ) { }

    static fromApiData(data: any, userLatitude: number, userLongitude: number, apiKey: string): Hospital {
        const latitude = data.geometry.coordinates[1];
        const longitude = data.geometry.coordinates[0];
        const distance = Hospital.calculateDistance(userLatitude, userLongitude, latitude, longitude);
        return new Hospital(
            data.properties.name || "Unnamed Hospital",
            latitude,
            longitude,
            distance,
            data.properties.phone || "Not available",
            `https://api.geoapify.com/v1/icon/?type=awesome&color=%23FF4B4B&size=large&icon=hospital&apiKey=${apiKey}`
        );
    }

    // Function to calculate distance between two coordinates (latitude and longitude)
    static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1); // Convert degrees to radians
        const dLon = this.deg2rad(lon2 - lon1); // Convert degrees to radians
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance * 1000; // Convert to meters
    }

    private static deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}

// Service class to handle API requests
class HospitalService {
    private static readonly apiKey = "2764357a0e974fc4bbc9a1094e719823"; // Replace with your actual API key

    static async fetchHospitals(latitude: number, longitude: number): Promise<Hospital[]> {
        const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&bias=proximity:${latitude},${longitude}&limit=5&apiKey=${this.apiKey}&lang=en`;
        const response = await axios.get(url);

        return response.data.features.map((item: any) =>
            Hospital.fromApiData(item, latitude, longitude, this.apiKey)
        );
    }
}

// Component for individual hospital cards
const HospitalCard = ({ hospital, onCall }: { hospital: Hospital; onCall: (phone: string) => void }) => (
    <View style={styles.hospitalCard}>
        <Text style={styles.hospitalName}>{hospital.name}</Text>
        <Text style={styles.hospitalDetails}>Distance: {hospital.distance.toFixed(2)} meters</Text>
        <Button title={`Call ${hospital.phone}`} onPress={() => onCall(hospital.phone)} color="#FF4B4B" />
    </View>
);

// Main screen component
export const HospitalsScreen = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [location, setLocation] = useState<any>(null);
    const [nearestHospital, setNearestHospital] = useState<Hospital | null>(null);

    useEffect(() => {
        const getHospitals = async () => {
            try {
                // Request location permission
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Location permission is required to find nearby hospitals.");
                    return;
                }

                // Get user location
                const userLocation = await Location.getCurrentPositionAsync({});
                setLocation(userLocation.coords);

                // Fetch hospitals
                const hospitalData = await HospitalService.fetchHospitals(
                    userLocation.coords.latitude,
                    userLocation.coords.longitude
                );

                // Sort hospitals by distance and get the nearest one
                const sortedHospitals = hospitalData.sort((a, b) => a.distance - b.distance);
                setHospitals(sortedHospitals);
                setNearestHospital(sortedHospitals[0]); // The first one is the nearest
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.error("Axios error:", error.response?.data);
                    Alert.alert("Error", "Failed to retrieve hospital data.");
                } else if (error instanceof Error) {
                    console.error("Error message:", error.message);
                    Alert.alert("Error", "An unexpected error occurred.");
                } else {
                    console.error("Unknown error:", error);
                    Alert.alert("Error", "An unexpected error occurred.");
                }
            } finally {
                setLoading(false);
            }
        };

        getHospitals();
    }, []);

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`).catch((err) => {
            console.error("Error making call:", err);
            Alert.alert("Error", "Failed to make the call.");
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Nearby Hospitals</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF4B4B" style={styles.loader} />
            ) : (
                <>
                    {/* Map displaying hospitals */}
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location?.latitude || 37.78825,
                            longitude: location?.longitude || -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {hospitals.map((hospital, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: hospital.latitude,
                                    longitude: hospital.longitude,
                                }}
                                title={hospital.name}
                                description={`Distance: ${hospital.distance.toFixed(2)} meters`}
                                image={{ uri: hospital.iconUrl }}
                            />
                        ))}
                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                title="Your Location"
                                pinColor="blue"
                            />
                        )}
                    </MapView>

                    {/* Nearest hospital card */}
                    {nearestHospital && (
                        <HospitalCard key={nearestHospital.name} hospital={nearestHospital} onCall={handleCall} />
                    )}

                    {/* List of hospitals */}
                    {hospitals.map((hospital, index) => (
                        <HospitalCard key={index} hospital={hospital} onCall={handleCall} />
                    ))}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#FF4B4B",
    },
    loader: {
        marginTop: 20,
    },
    map: {
        width: "100%",
        height: 300,
        marginBottom: 20,
    },
    hospitalCard: {
        backgroundColor: "white",
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    hospitalName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    hospitalDetails: {
        fontSize: 16,
        color: "#777",
        marginBottom: 10,
    },
});

export default HospitalsScreen;
