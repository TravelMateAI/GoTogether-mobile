import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import React from "react";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const embassyContacts = {
    USA: [
        {
            name: "US Embassy - Colombo",
            address: "210 Galle Rd, Colombo 03, Sri Lanka",
            phone: "+94 11 2498500",
            email: "conscolombo@state.gov",
            website: "https://lk.usembassy.gov/",
        },
        {
            name: "US Consulate - Jaffna",
            phone: "+94 21 2221234",
        },
    ],
    UK: [
        {
            name: "British High Commission",
            address: "389 Bauddhaloka Mawatha, Colombo 07",
            phone: "+94 11 5390639",
            email: "britembsl@fco.gov.uk",
            website: "https://www.gov.uk/world/organisations/british-high-commission-colombo",
        },
    ],
    India: [
        {
            name: "Indian High Commission",
            address: "36-38 Galle Road, Colombo 03",
            phone: "+94 11 2422788",
            email: "cons.colombo@mea.gov.in",
            website: "https://hcicolombo.gov.in",
        },
        {
            name: "Deputy High Commission - Kandy",
            phone: "+94 81 2222222",
        },
    ],
};

export default function EmbassyContactsScreen() {
    const theme = Colors[useColorScheme() ?? "light"];

    const handleLink = (url: string) => {
        Linking.openURL(url);
    };

    const renderEmbassyDetails = (embassy: any) => (
        <ScrollView style={[styles.card, { backgroundColor: theme.background }]} key={embassy.name}>
            <Text style={[styles.embassyName, { color: theme.text }]}>{embassy.name}</Text>
            {embassy.address && <Text style={styles.embassyInfo}>{embassy.address}</Text>}
            {embassy.phone && <Text style={styles.embassyInfo}>{embassy.phone}</Text>}
            {embassy.email && <Text style={styles.embassyInfo}>{embassy.email}</Text>}
            {embassy.website && (
                <TouchableOpacity onPress={() => handleLink(embassy.website)}>
                    <Text style={[styles.link, { color: theme.tint }]}>Visit Website</Text>
                </TouchableOpacity>
            )}
            <View style={styles.actions}>
                {embassy.phone && (
                    <TouchableOpacity onPress={() => handleLink(`tel:${embassy.phone}`)}>
                        <IconSymbol name="phone" size={22} color="green" />
                    </TouchableOpacity>
                )}
                {embassy.email && (
                    <TouchableOpacity onPress={() => handleLink(`mailto:${embassy.email}`)}>
                        <IconSymbol name="envelope" size={22} color="#EA580C" />
                    </TouchableOpacity>
                )}
            </View>
        </ScrollView>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Object.entries(embassyContacts).map(([country, embassies]) => (
                <View key={country} style={styles.section}>
                    <Text style={[styles.country, { color: theme.text }]}>{country}</Text>
                    {renderEmbassyDetails(embassies[0])}
                    {embassies.length > 1 && (
                        <View style={styles.subList}>
                            {embassies.slice(1).map((emb, idx) => (
                                <Text key={idx} style={[styles.subEmbassy, { color: theme.text }]}>
                                    • {emb.name}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    country: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: "#E5E7EB",
        marginBottom: 10,
    },
    embassyName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    embassyInfo: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 2,
    },
    link: {
        fontSize: 13,
        fontWeight: "500",
        marginTop: 6,
        textDecorationLine: "underline",
    },
    actions: {
        flexDirection: "row",
        gap: 16,
        marginTop: 10,
    },
    subList: {
        marginTop: 8,
        paddingLeft: 10,
    },
    subEmbassy: {
        fontSize: 14,
        marginBottom: 4,
    },
});
