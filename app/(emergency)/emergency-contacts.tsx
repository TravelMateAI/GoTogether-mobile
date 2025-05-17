import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Alert, FlatList, Linking, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Contact {
    name: string;
    phone: string;
}

export default function EmergencyContactsScreen() {

    const colorSchemeName = "light";
    const colorScheme = Colors[colorSchemeName];
    const [contacts, setContacts] = useState<Contact[]>([
        { name: "Home", phone: "tel:111" },
        { name: "Someone ", phone: "tel:555" },
    ]);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const addContact = () => {
        if (!name.trim() || !phone.trim()) {
            Alert.alert("Error", "Please enter both name and phone number.");
            return;
        }
        setContacts([...contacts, { name, phone: "tel:" + phone }]);
        setName("");
        setPhone("");
        setModalVisible(false);
    };

    return (
        <View style={{ ...styles.container, backgroundColor: colorScheme.background }}>
            <FlatList
                data={contacts}
                keyExtractor={(item, idx) => item.phone + idx}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.contactCard}
                        onPress={() => {
                            const phoneNumber = item.phone.startsWith('tel:') ? item.phone : `tel:${item.phone}`;
                            Linking.canOpenURL(phoneNumber).then((supported) => {
                                if (supported) {
                                    Linking.openURL(phoneNumber);
                                } else {
                                    Alert.alert("Error", "Unable to open the dialer.");
                                }
                            });
                        }}
                    >
                        <View>
                            <Text style={{ ...styles.contactName, color: colorScheme.text }}>{item.name}</Text>
                            <Text style={styles.contactPhone}>{item.phone.replace('tel:', '')}</Text>
                        </View>
                        <IconSymbol name="phone" size={24} color="green" />
                    </TouchableOpacity>
                )}
            />
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Add Contact</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="none"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.addHeader}>Add New Contact</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                            <Pressable style={[styles.button, { flex: 1, backgroundColor: '#E5E7EB' }]} onPress={() => setModalVisible(false)}>
                                <Text style={[styles.buttonText, { color: '#111' }]}>Cancel</Text>
                            </Pressable>
                            <Pressable style={[styles.button, { flex: 1 }]} onPress={addContact}>
                                <Text style={styles.buttonText}>Add</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    contactCard: {
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderWidth: 0.5,
        borderColor: "#E5E7EB",
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
    },
    contactPhone: {
        fontSize: 14,
        color: '#6B7280',
    },
    addHeader: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6B5CFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
});