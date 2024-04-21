import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState, useContext, useCallback } from "react";
import {
    Button,
    ImageBackground,
    Pressable,
    SafeAreaView,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    RefreshControl,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";
import useSWR, { preload, useSWRConfig, mutate } from "swr";

export default function LeaderboardView () {
    const { token, team } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const { data } = useSWR(`api/v1/teams/${team}`);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log("ahhhhh")
    setRefreshing(true);
    mutate(`api/v1/teams/${team}`).then(() => {
      setRefreshing(false);
    });
  }, []);
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
        }}>
            <ScrollView style={{
                paddingHorizontal: 12
            }} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
                <View style={{
                    paddingTop: 12
                }}>
                    <Text style={{ textAlign: "left", fontSize: 30 }}>{data?.name}'s Leaderboard</Text>
                </View>
                {
                    data?.leaderboard.map((u, index) => {
                        return (
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Image source={{ uri: u.last_spot_image }} style={{
                                    aspectRatio: 1,
                                    borderRadius: 45
                                }} width={40} />
                                <Text style={{textAlign: 'center', fontSize: 20, flexGrow: 1}}>
                                    {u.name}
                                </Text>
                                <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 800}}>
                                    {u.points}
                                </Text>
                                <Image source={{ uri: "https://cloud-ewgxjx5ts-hack-club-bot.vercel.app/0acorn_png_clipart_picture.png" }} style={{
                                    aspectRatio: 1,
                                    borderRadius: 45
                                }} width={10} />
                            </View>
                        )
                    }
                )}
            </ScrollView>
        </View>
    )
}
