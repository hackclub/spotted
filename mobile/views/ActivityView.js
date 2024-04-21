import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Camera } from "expo-camera";
import { useRef, useState, useContext, useCallback } from "react";
import {
    Button,
    Image,
    ImageBackground,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';
import AuthContext from "../auth";
import { FlatList } from 'react-native';
import useSWR, { preload, useSWRConfig, mutate } from "swr";

export default function ActivityView () {
    const { token, team } = useContext(AuthContext);
    const { fetcher, mutate } = useSWRConfig();
    const [refreshing, setRefreshing] = useState(false);
    const { data } = useSWR(`api/v1/teams/${team}`);
    console.log(data);

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
                    <Text style={{ textAlign: "left" }}>Recent activity in</Text>
                    <Text style={{ textAlign: "left", fontSize: 30 }}>{data?.name}</Text>
                </View>
                {
                    data?.activity_log.map(log => {
                        return (
                            <View style={{
                                paddingTop: 12
                            }}>
                                <View style={{
                                    backgroundColor: "orange",
                                    padding: 12,
                                    borderRadius: 12,
                                }}>
                                    <Text style={{ textAlign: "left", paddingBottom: 12 }}>
                                        <Text style={{color: "#BA3939"}}>{log.spotter.name}</Text> {log.action} <Text style={{color: "#BA3939"}}>{log.spotted.name}</Text> {log.ago}
                                    </Text>
                                    <Image source={{ uri: log.picture }} width={"100%"} style={{ aspectRatio: 1}} />
                                </View>
                            </View>
                        )
                    }
                )}
            </ScrollView>
        </View>
    )
}
