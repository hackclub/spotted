import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState } from "react";
import {
    Button,
    ImageBackground,
    Pressable,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { isLoggedIn, login } from '../auth'
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';

export default function LeaderboardView () {
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center"
        }}>
            <Text style={{ textAlign: "center" }}>
                Leaderboard
            </Text>
        </View>
    )
}
