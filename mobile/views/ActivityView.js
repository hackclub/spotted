import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState, useContext } from "react";
import {
    Button,
    Image,
    ImageBackground,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";
import { FlatList } from 'react-native';
import useSWR, { preload, useSWRConfig, mutate } from "swr";

export default function ActivityView () {
    const { token, team } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/${team}`);
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
        }}>
            <ScrollView style={{
                paddingHorizontal: 12
            }}>
                <View style={{
                    paddingTop: 12
                }}>
                    <Text style={{ textAlign: "left" }}>Recent activity in</Text>
                    <Text style={{ textAlign: "left", fontSize: "30px" }}>Cal Hacks</Text>
                </View>
                <View style={{
                    paddingTop: 12
                }}>
                    <View style={{
                        backgroundColor: "orange",
                        padding: 12,
                        borderRadius: 12,
                    }}>
                        <Text style={{ textAlign: "left", paddingBottom: 12 }}>
                            <Text style={{color: "#BA3939"}}>sampoder</Text> spotted <Text style={{color: "#BA3939"}}>mha</Text>
                        </Text>
                        <Image source={{ uri: "https://assets.hackclub.com/hcb-light.png" }} width={"100%"} style={{ aspectRatio: 1}} />
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
