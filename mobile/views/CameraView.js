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
import useSWR, { preload, useSWRConfig, mutate } from "swr";

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

export default function CameraView() {
    const { token, team } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/${team}`);
    const [status, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [lastPhotoURI, setLastPhotoURI] = useState(null);
    const cameraRef = useRef(null);
    
    async function createSpot(spottedID){
        try {
            const body = new FormData();
            body.append("spotted_id", spottedID);
            body.append("image", dataURItoBlob(lastPhotoURI));
            let response = await fetch(`http://sourdough.local:3001/api/v1/spots`,
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
            Alert.alert(`SPOT! Nice work. You earned ${response.points} points.`);
            setLastPhotoURI(null)
        }
    }

    console.log(data)

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
            <ImageBackground
                source={{ uri: lastPhotoURI }}
                style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 0.2,
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#666",
                        marginBottom: 40
                    }}
                    onPress={() => {
                        setLastPhotoURI(null);
                    }}
                >
                    <Text style={{ fontSize: 30, padding: 10, color: "white" }}>❌</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }

    return (
        <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flex: 0.2,
                        alignSelf: "flex-end",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#666",
                        marginBottom: 40
                    }}
                    onPress={async () => {
                        if (cameraRef.current) {
                            let photo = await cameraRef.current.takePictureAsync();
                            setLastPhotoURI(photo.uri);
                        }
                    }}
                >
                    <Text style={{ fontSize: 30, padding: 10, color: "white" }}>📸</Text>
                </TouchableOpacity>
            </View>
        </Camera>
    );
}
