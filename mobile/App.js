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

function Tab ({ name, onClick }) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={{
        backgroundColor: 'white',
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1
      }} onPointerDown={onClick}>
        <View style={{
          minWidth: 100,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text style={{
            fontWeight: "bold",
            color: "black"
          }}>{name}</Text>
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
          justifyContent: "space-around"
        }}>
          <Tab name="Review" onClick={() => setActiveTab(0)} />
          <Tab name="Capture" onClick={() => setActiveTab(1)} />
          <Tab name="Configure" onClick={() => setActiveTab(2)} />
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

  return (
  <Nav screen2={<Cam />} />
);
  
}
