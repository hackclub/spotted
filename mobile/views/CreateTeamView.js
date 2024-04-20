import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState, useContext } from "react";
import {
    Button,
    ImageBackground,
    Pressable,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";

export default function CreateTeamView () {
    const { token, setTeam } = useContext(AuthContext);
    async function joinTeam(teamID) {
        try {
            const body = new FormData();
            body.append("team_id", teamID);
            let response = await fetch(`http://sourdough.local:3001/api/v1/members`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body,
                },
            ).then(r => r.json());
        } catch (e) {
            Alert.alert("Something went wrong.");
        } finally {
            Alert.alert(`Welcome to the team.`);
            setTeam(teamID);
        }
    }
    async function createTeam(name, emoji) {
        try {
            const body = new FormData();
            body.append("name", name);
            body.append("emoji", emoji);
            let response = await fetch(`http://sourdough.local:3001/api/v1/teams`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body,
                },
            ).then(r => r.json())
            .then(r => joinTeam(r.id));
        } catch (e) {
            Alert.alert("Something went horribly wrong.");
        } finally {
            Alert.alert(`Welcome to the team.`);
            setTeam(teamID);
        }
    }
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center"
        }}>
            <Text style={{ textAlign: "center" }}>
                You don't have a team yet, create one or join on.
            </Text>
        </View>
    )
}
