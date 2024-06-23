import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CDrawerContent from "../../components/CDrawerContent"

// drawerHideStatusBarOnOpen:true,

const Layout = () => {
    return (
        <GestureHandlerRootView style={{flex:1,}}>
            <Drawer drawerContent = {CDrawerContent} 
            screenOptions={{
                
                drawerActiveBackgroundColor:"#4a4f5b",
                drawerActiveTintColor:"#fff",
                drawerLabelStyle:{marginLeft: -20},
                drawerInactiveBackgroundColor:'#4a4f5b',
                drawerInactiveTintColor:"#fff",
            }}
            
            >
            <Drawer.Screen name='pod'
                    options={{
                        drawerLabel:"Outstanding POD`s",
                        headerTitle:" Outstanding POD`s",
                        drawerIcon:({
                            size,color
                        }) =>(
                            <Ionicons name="list" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen name='rfc'
                    options={{
                        drawerLabel:"Outstanding RFC`s",
                        headerTitle:"Outstanding RFC`s",
                        drawerIcon:({
                            size,color
                        }) =>(
                            <Ionicons name="list" size={size} color={color} />
                        ),
                    }}
                />                
                <Drawer.Screen name='itr'
                    options={{
                        drawerLabel:"Outstanding ITR`s",
                        headerTitle:"Outstanding ITR`s",
                        drawerIcon:({
                            size,color
                        }) =>(
                            <Ionicons name="list" size={size} color={color} />
                        ),
                    }}
                />

            </Drawer>
        </GestureHandlerRootView>
    );
}

export default Layout;