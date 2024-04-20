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


function Tab({ bg, name, onClick }) {
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

            <SafeAreaView style={{
                width: "100%",
                borderTopColor: "#64ced3",
                borderTopWidth: "1px",
            }}>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: "0px"
                }}>
                    <Tab name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Entypo name="home" size={24} color="black" />
                            <Text>Home</Text>
                        </View>
                    } onClick={() => setActiveTab(0)} />
                    <Tab bg={activeTab == 1 ? "red" : "green"} name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            {activeTab == 1 ? <>
                                <FontAwesome6 name="circle-dot" size={40} color="black" />
                            </> : <>
                                <Entypo name="camera" size={24} color="black" />
                                <Text>Camera</Text>
                            </>}
                        </View>
                    } onClick={activeTab == 1 ? () => {
                        console.log("Shutter");
                    } : () => setActiveTab(1)} />
                    <Tab name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <MaterialCommunityIcons name="podium" size={24} color="black" />
                            <Text>Leaderboard</Text>
                        </View>
                    } onClick={() => setActiveTab(2)} />
                </View>
            </SafeAreaView>
        </View>
    )
}