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
    TouchableHighlight,
    View,
    Alert
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";
import useSWR, { preload, useSWRConfig, mutate } from "swr";


function Tab({ bg, name, onClick, style }) {
    return (
        <TouchableOpacity style={{ flexGrow: 1, flexBasis: "auto" }} onPress={onClick}>
            <View style={{
                backgroundColor: bg,
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: "auto",
                ...style
            }} onPointerDown={onClick}>
                <View style={{
                    minWidth: 100,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    {name}
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default function NavView({
    Screen1,
    Screen2,
    Screen3
}) {
    const [activeTab, setActiveTab] = useState(0);
    const Current = {
        [0]: Screen1,
        [1]: Screen2,
        [2]: Screen3,
    }[activeTab];
    const { token } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/`);
    console.log(data)

    return (

        <View style={{
            flex: 1,
        }}>

            <View style={{
                backgroundColor: 'white',
                width: "100%",
                flexGrow: 1,
            }}>

                <Current />
            </View>
            <View style={{
                backgroundColor: 'white',
                width: "100%",
                marginTop: '50px'
            }}>
                <TouchableHighlight underlayColor="#AAAAAA" onPress={async () => {
                    try {
                        const body = new FormData();
                        body.append("name", "Sam1");
                        await fetch(`http://sourdough.local:3001/api/v1/me`,
                            {
                                method: "POST",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                body,
                            },
                        );
                        mutate("/api/v1/me")
                    } catch (e) {
                        Alert.alert("Something went wrong.");
                    } finally {
                        Alert.alert("Something went well.");
                    }
                }}>
                    <Text>{JSON.stringify(data)}</Text>
                </TouchableHighlight>

            </View>

            <SafeAreaView style={{
                width: "100%",
                borderTopColor: "#64ced3",
                borderTopWidth: "1px",
                backgroundColor: "#BA3939"
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "0px"
                }}>
                    <Tab style={activeTab == 1 ? { margin: 10, height: 50 } : {}} name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="white" />
                            <Text style={{
                                color: "white",
                            }}>Activity</Text>
                        </View>
                    } onClick={() => setActiveTab(0)} />
                    <Tab bg={activeTab == 1 ? "red" : "green"} style={activeTab == 1 ? {
                        borderTopLeftRadius: 35,
                        borderTopRightRadius: 35,
                        borderBottomLeftRadius: 35,
                        borderBottomRightRadius: 35,
                        backgroundColor: "red",
                        margin: 10,
                        height: 50
                    } : {}} name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            {activeTab == 1 ? <>
                                <FontAwesome6 name="circle-dot" size={40} color="white" />
                            </> : <>
                                <Entypo name="camera" size={24} color="white" />
                                <Text style={{
                                    color: "white"
                                }}>Camera</Text>
                            </>}
                        </View>
                    } onClick={activeTab == 1 ? () => {
                        console.log("Shutter");
                    } : () => setActiveTab(1)} />
                    <Tab style={activeTab == 1 ? { margin: 10, height: 50 } : {}} name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <MaterialCommunityIcons name="podium" size={24} color="white" />
                            <Text style={{
                                color: "white"
                            }}>Leaderboard</Text>
                        </View>
                    } onClick={() => setActiveTab(2)} />
                </View>
            </SafeAreaView>
        </View>
    )
}