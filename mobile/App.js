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
import {isLoggedIn, login} from './auth'

function Tab ({ bg, name, onClick }) {
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

function Nav ({
  screen1,
  screen2,
  screen3
}) {
  const [activeTab, setActiveTab] = useState(0);
  return (

    <View style={{
      flex: 1,
    }}>
      <View style={{
        backgroundColor: 'white',
        width: "100%",
        flexGrow: 1,
      }}>
        {{
          [0]: screen1,
          [1]: screen2,
          [2]: screen3,
        }[activeTab]}
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
          } onClick={() => setActiveTab(1)} />
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

function Cam () {
  
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

export default function App() {

  if(!isLoggedIn()){
      return (
        <View>
          <Button title="Sign in!" onPress={() => login()} />
        </View>
      )
  }

  return (
  <Nav screen2={<Cam />} />
);
  
}
