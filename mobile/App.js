globalThis.HOST = "https://spotted.underpass.clb.li";
const forceSignIn = false;
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useContext, useEffect, useState, useCallback } from "react";
import {
  Button,
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as SecureStorage from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import NavView from './views/NavView';
import CameraView from './views/CameraView';
import HomeView from './views/ActivityView';
import LeaderboardView from './views/LeaderboardView';
import CreateTeamView from './views/CreateTeamView';
import { SWRConfig } from "swr";
import {
  useAuthRequest,
  makeRedirectUri,
  exchangeCodeAsync,
  DiscoveryDocument,
} from "expo-auth-session";
import AuthContext from "./auth";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

export const discovery = {
  authorizationEndpoint: `${globalThis.HOST}/oauth/authorize`,
  tokenEndpoint: `${globalThis.HOST}/oauth/token`,
  revocationEndpoint: `http://sourdough.local:3001//oauth/revoke`,
};

console.log(globalThis.HOST);

const redirectUri = makeRedirectUri();

import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  const [orientation, setOrientation] = useState(1);
  useEffect(() => {
    lockOrientation();
  }, []);
  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  const o = await ScreenOrientation.getOrientationAsync();
    setOrientation(o);
  };


  console.log(redirectUri)
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "jPQoX0dOXmPdjW2Rna6Y0RfA0zQ29s6ny_9ZZcUNzEI",
      redirectUri,
      scopes: ["read", "write"]
    },
    discovery,
  );

  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState(null);

  const [team, setTeam] = useState(null);

  const fetcher = useCallback(
    (url) =>
      fetch(`${globalThis.HOST}/` + url, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          if (body.error === "invalid_auth" || body == undefined) {
            setToken("");
            return;
          } else {
            throw body;
          }
        }

        return body;
      }),
    [token],
  );

  useEffect(() => {
    (async () => {
      const token = await SecureStorage.getItemAsync("token");
      setToken(token);
      const team = await SecureStorage.getItemAsync("team");
      console.log(team)
      console.log("I RAN")
      setTeam(team);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (typeof team == "string") SecureStorage.setItemAsync("team", team);
  }, [team]);
  
  useEffect(() => {
    if (typeof token == "string") SecureStorage.setItemAsync("token", token);
  }, [token]);

  useEffect(() => {
    if (response?.type == "success") {
      setLoading(true);
      exchangeCodeAsync(
        {
          clientId: "jPQoX0dOXmPdjW2Rna6Y0RfA0zQ29s6ny_9ZZcUNzEI",
          redirectUri,
          code: response.params.code,
          extraParams: { code_verifier: request.codeVerifier },
        },
        discovery,
      )
        .then(async (r) => {
          setToken(r.accessToken);
          await fetch(`${globalThis.HOST}/api/v1/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((r) => r.json())
            .then((r) => {
              console.log(r)
              setTeam(r.teams.length > 0 ? r.teams[0].id.toString() : null);
            });
        })
        .catch(() => setLoading(false));
    }
  }, [response]);

  console.log({
    token, team, forceSignIn
  })

  if (!token || !team || forceSignIn) {
    return (
      <AuthContext.Provider value={{ token, setToken }}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          
          <Button title="Sign in!" onPress={() => promptAsync()} />
        </View>
      </AuthContext.Provider>
    );
  }

  console.log(team)

  if(!team){
    return (
      <AuthContext.Provider value={{ token, setToken }}>
        <CreateTeamView /> 
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ token, team, setToken, setTeam }}>
      {(console.log(team), null)}
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        <NavView
            Screen1={HomeView}
            Screen2={CameraView}
            Screen3={LeaderboardView}
onBadData={() => promptAsync()}
          />
      </SWRConfig>
    </AuthContext.Provider>
  );
  
}
