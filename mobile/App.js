import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useContext, useEffect, useState } from "react";
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
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import NavView from './views/NavView';
import CameraView from './views/CameraView';
import HomeView from './views/HomeView';
import LeaderboardView from './views/LeaderboardView';
import {
  useAuthRequest,
  makeRedirectUri,
  exchangeCodeAsync,
  DiscoveryDocument,
} from "expo-auth-session";

export const discovery = {
  authorizationEndpoint: `http://localhost:10524/oauth/authorize`,
  tokenEndpoint: `http://localhost:10524/oauth/token`,
  revocationEndpoint: `http://localhost:10524//oauth/revoke`,
};

const redirectUri = makeRedirectUri();

export default function App() {
  const [authStatus, setAuthStatus] = useState(isLoggedIn());
  console.log({ authStatus })

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "jPQoX0dOXmPdjW2Rna6Y0RfA0zQ29s6ny_9ZZcUNzEI",
      redirectUri,
      scopes: ["read", "write"]
    },
    discovery,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (response?.type == "success") {
      setLoading(true);
      exchangeCodeAsync(
        {
          clientId,
          redirectUri,
          code: response.params.code,
          extraParams: { code_verifier: request.codeVerifier },
        },
        discovery,
      )
        .then((r) => {
          console.log(r.accessToken);
        })
        .catch(() => setLoading(false));
    }
  }, [response]);

  if (!authStatus) {
    return (
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Button title="Sign in!" onPress={() => promptAsync()} />
        
        <Button title="Pretend to sign in" onPress={() => setAuthStatus(true)} />
      </View>
    );
  }

  return (
    <NavView
      Screen1={HomeView}
      Screen2={CameraView}
      Screen3={LeaderboardView}
    />
  );
  
}
