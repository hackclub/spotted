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

export default function CameraView() {

    const { token } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/1`);
    console.log(data)

    const [status, requestPermission] = Camera.useCameraPermissions();
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [lastPhotoURI, setLastPhotoURI] = useState(null);
    const cameraRef = useRef(null);

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
                        marginBottom: 40,
                        marginLeft: 20,
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
                        marginBottom: 40,
                        marginLeft: 20,
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
