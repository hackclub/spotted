import { FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState, useContext } from "react";
import {
    Alert,
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
import useSWR, { preload, useSWRConfig, mutate } from "swr";

var atob = require('atob');

export default function CameraView() {
    const { token, team } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/${team}`);
    const { data: me } = useSWR(`api/v1/me`);
    const [status, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [lastPhotoURI, setLastPhotoURI] = useState(null);
    const [lastPhotoBase64, setLastPhotoBase64] = useState(null);
    const [analyzed, setAnalyzed] = useState(false);
    const cameraRef = useRef(null);


    async function createSpot(spottedID) {
        let response
        try {
            const body = new FormData();
            body.append("spotted_id", spottedID);
            body.append("image", {
                uri: 'data:image/jpeg;base64,' + lastPhotoBase64,
                name: 'photo.jpg',
                type: 'image/jpeg'
            });
            response = await fetch(`${globalThis.HOST}/api/v1/spots`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body,
                },
            ).then(r => r.json());
        } catch (e) {
            console.error(e)
            Alert.alert("Something went wrong.");
        } finally {
            Alert.alert(`SPOT! Nice work. You earned ${response.points} points.`);
            setLastPhotoURI(null);
            setAnalyzed(false);
        }
    }

    console.log(data)
    console.log(me)

    // data.leaderboard

    if (!status?.granted) {
        return (
            <View
                style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
            >
                <Text style={{ textAlign: "center" }}>
                    We need access to your camera
                </Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    if (lastPhotoURI !== null) {
        return (
            <View>
                <ImageBackground
                    source={{ uri: lastPhotoURI }}
                    style={{
                        aspectRatio: 3 / 4,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        width: "100%"
                    }}
                >

                    <TouchableOpacity activeOpacity={1}
                        style={{
                            backgroundColor: "#33333399",
                            height: "100",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            gap: 12,
                            borderTopEndRadius: 8
                        }}
                    >
                        {analyzed ? (<>
                            <Octicons name="squirrel" size={24} color="white" />
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "400" }}>0 Squirrels Found <Text style={{
                                fontWeight: "bold"
                            }}>+0 bonus</Text></Text>
                            </>
                        ) : (
                            <>
                                <MaterialIcons name="search" size={24} color="white" />
                                <Text style={{ color: "white", fontSize: 16, fontWeight: "400" }}>Analyzing Image...</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#33333399",
                            height: "100",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 10,
                            gap: 12,
                            borderTopStartRadius: 8
                        }}
                        onPress={() => {
                            setLastPhotoURI(null);
                            setAnalyzed(false);
                        }}
                    >

                        <FontAwesome name="repeat" size={24} color="white" />

                        <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Retake</Text>

                    </TouchableOpacity>
                </ImageBackground>
                <ScrollView horizontal contentContainerStyle={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'start', gap: 16, paddingVertical: 16, paddingLeft: 16, flexGrow: 1 }}>
                    {data?.leaderboard?.map(u => {
                        return (
                            <TouchableOpacity activeOpacity={2 / 3} key={u.id} onPress={() => createSpot(u.id)} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image source={{ uri: u.last_spot_image }} style={{
                                    aspectRatio: 1,
                                    borderRadius: 45
                                }} width={90} />
                                <Text style={{ textAlign: 'center', fontSize: 20 }}>
                                    {u.name}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}</ScrollView>


            </View>
        );
    }

    return (
        <View style={{
            flexDirection: "column",
            display: "flex",
            height: "100%",
            gap: -16,
        }}>
            <Camera style={{ width: "100%", height: "100%", justifyContent: "flex-end" }} type={type} ref={cameraRef}>

                <View
                    style={{
                        backgroundColor: "transparent",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderTopRightRadius: 16,
                        borderTopLeftRadius: 16,
                        backgroundColor: "#16181E88",
                        height: 160
                    }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#BA3939",
                            borderRadius: "50%",
                            height: 80,
                            aspectRatio: 1
                        }}
                        onPress={async () => {
                            if (cameraRef.current) {
                                let photo = await cameraRef.current.takePictureAsync({ base64: true });
                                setLastPhotoURI(photo.uri);
                                setLastPhotoBase64(photo.base64);
                                setTimeout(() => {
                                    setAnalyzed(true);
                                }, 3000);
                                // fetch(`https://gemini-ai.hackclub.dev/api/ai`, {
                                //     method: "POST",
                                //     body: JSON.stringify({ base64: photo.base64, mime: "image/jpeg" })
                                // }).then(r => r.json()).then(r => setSqCount(r.number))
                            }
                        }}
                    >
                        <FontAwesome6 name="circle-dot" size={50} color="white" />

                    </TouchableOpacity>
                </View>

            </Camera>
        </View>
    );
}
