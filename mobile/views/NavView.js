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
    Alert,
    StatusBar
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";
import useSWR, { preload, useSWRConfig, mutate } from "swr";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from './ActivityView';
import CameraView from './CameraView';
import LeaderboardView from './LeaderboardView';
import ActivityView from './ActivityView';

// needs current user

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

const NavTab = createBottomTabNavigator();


const RootStack = createNativeStackNavigator();



export default function NavView() {
    return (

        <NavigationContainer>
            <RootStack.Navigator screenOptions={{
                headerShown: false
            }}>
                <RootStack.Group>
                    <RootStack.Screen name="Home" component={F} />
                </RootStack.Group>
                <RootStack.Group screenOptions={{ presentation: 'modal' }}>
                    <RootStack.Screen name="MyModal" component={M} />
                </RootStack.Group>
            </RootStack.Navigator>
        </NavigationContainer>
    )
}

function M() {
    return (
        <Text>hi</Text>
    )
}

function F({ navigation }) {
    StatusBar.setBarStyle("light-content");
    return (

        <NavTab.Navigator screenOptions={{
            tabBarStyle: {
                backgroundColor: "#BA3939"
            },
            headerStyle: {
                backgroundColor: "#BA3939",
            },
            headerTintColor: "white"
        }}>
            <NavTab.Screen name="Activity" component={ActivityView} options={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <MaterialCommunityIcons name="chart-timeline-variant" size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
            })} />
            <NavTab.Screen name="Camera" component={CameraView} options={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <Entypo name="camera" size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white'
            })} />
            <NavTab.Screen name="Leaderboard" component={LeaderboardView} options={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    return <MaterialCommunityIcons name="podium" size={size} color={color} />;
                },
                tabBarActiveTintColor: 'white',
                tabBarInactiveTintColor: 'white',
            })} />
        </NavTab.Navigator>

    )
    const [activeTab, setActiveTab] = useState(0);
    const Current = {
        [0]: Screen1,
        [1]: Screen2,
        [2]: Screen3,
    }[activeTab];
    const { token } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/`);
    return (

        <View style={{
            flex: 1,
        }}>
            {activeTab == 1 ? (

                <SafeAreaView style={{
                    backgroundColor: "#16181E",
                    flexDirection: "row",
                }} />

            ) : (

                <SafeAreaView style={{
                    backgroundColor: "#BA3939",
                    flexDirection: "row",
                }}>
                    <View style={{

                        flex: 1,

                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 12
                    }}>
                        <Text style={{
                            color: "white"
                        }}>sampoder</Text>
                        <Text style={{
                            color: "white"
                        }}>cal hacks</Text>
                    </View>
                </SafeAreaView>
            )}

            <View style={{
                backgroundColor: 'white',
                width: "100%",
                flexGrow: 1,
            }}>

                <Current />
            </View>

            <SafeAreaView style={{
                width: "100%",
                backgroundColor: activeTab == 1 ? "#16181E" : "#BA3939"
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
                            <MaterialCommunityIcons name="chart-timeline-variant" size={24} color="white" />
                            <Text style={{
                                color: "white",
                            }}>Activity</Text>
                        </View>
                    } onClick={() => setActiveTab(0)} />
                    <Tab name={
                        <View style={{
                            flexDirection: "column",
                            gap: 6,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: activeTab == 1 ? "#BA3939" : null,
                            padding: 12,
                            borderRadius: 100,
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
                    <Tab name={
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