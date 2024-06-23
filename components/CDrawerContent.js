import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View, Animated,Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthAsyncStorageContext';

export default function CDrawerContent(props){
    const router = useRouter(); 
    const {top,bottom} = useSafeAreaInsets();
    const { onLogout } = useAuth();// onPress={() => router.replace('/')}
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props} 
            scrollEnabled={false}
            contentContainerStyle={{backgroundColor:"#2a2a2a", marginBottom:5}}>
            <View style={{padding:20,backgroundColor:"#fff",marginBottom:4}}>
                <Image
                source={ require("../assets/midas-logo.png") } style={{width:'100%',height:50,alignSelf:'center'}} />

            </View>
                <DrawerItemList {...props} />
                <DrawerItem label={"Preferences"} labelStyle={{color:"#fff",marginLeft: -20,}} onPress={()=> router.push("/preferences")} style={{backgroundColor:'#4a4f5b',}}
                    icon={({color,size}) =>(<Ionicons name="cog" size={24} color={'#fff'} />)} />
                <DrawerItem label={"LogOut"} labelStyle={{color:"#fff",marginLeft: -20,}} onPress={onLogout} style={{backgroundColor:'#4a4f5b'}}
                    icon={({color,size}) =>(<Ionicons name="log-out-outline" size={24} color={'#fff'} />)} />                    


            </DrawerContentScrollView>
            <View style={{
                borderTopColor:'#4a4f5b',
                color:"#fff",
                borderTopWidth:1,
                padding:20,
                paddingBottom:20 + bottom,
            }}>
                <Text>Version: 1.0.1</Text>
            </View>
        </View>
    )  
}

