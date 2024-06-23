import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator,TextInput,Image,Dimensions } from 'react-native';
import React, { useEffect,useState } from 'react';

import axios from 'axios';
import {API_URL, AUTH_STATE} from '../context/AuthAsyncStorageContext';
import responseJS from '../assets/itemdetail.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
const API_SEARCH = 'https:randomuser.me/api/?results=30';
const API_Data = 'https:randomuser.me/api/?results=30';


const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const Page = () => {
    // const [dimensions, setDimensions] = useState({
    //     window: windowDimensions,
    //     screen: screenDimensions,
    //   });
    const [dimensions, setDimensions] = useState({window: windowDimensions});
      const {height, width} = Dimensions.get('window');
    // const [users,setUsers] = useState<any[]>([]);
    const [details,setDetails] = useState<IDetail[]>([]);
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState(null);
    const [fullData,setFullData] = useState<IDetail[]>([]);
    const [searchQuery,setSearchQuery] = useState("");
    interface IDetail {
        "tt-actqty": string;  
        "tt-docno": string;
        "tt-ind": number;
        "tt-invtype": string; 
        "tt-item": string;
        "tt-line": number;
        "tt-noteid": string;
        "tt-orgprc": string;
        "tt-qty": string;
      }
    useEffect(()=>{
        setIsLoading(true);
        // const subscription = Dimensions.addEventListener(
        //     'change',
        //     ({window, screen}) => {
        //       setDimensions({window, screen});
        //     },
        //   );
        //   return () => subscription?.remove();

        //fetchData(API_SEARCH);      
        loadData();
        const subscription = Dimensions.addEventListener(
            'change',
            ({window}) => {
              setDimensions({window});
            },
          );
          return () => subscription?.remove();

    }, []);

    const loadData = async ()=>{
        try{
            const listItem = await AsyncStorage.getItem("Detail");
            const authUser = await AsyncStorage.getItem(AUTH_STATE);
            if(listItem != undefined && authUser != undefined){
                const user = await JSON.parse(authUser);
                const item = await JSON.parse(listItem);
                if(user!= undefined && item != undefined){
                    const ipcUserID = user['ipcUserID']; //'devatstbn'; // or devatstbc
                    const ipcPword = user['ipcPword']; //'steve';
                    const ipcType = user['cType']; //"CSR";
                    const ipcDocno = item['tt-docno'];// "BNE14655";

                    const url = `${API_URL}outPODPartDetail?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}&ipcDocno=${ipcDocno}&ipcType=${ipcType}`;
                    console.log(url);
                    const podData =  await axios.get(url);
                    // outPODPartDetail?ipcUserID=devatstbn&ipcPword=steve&ipcDocno=BNE14655&ipcType=CSR
                    http://appgate.elcb.co.za:9888/MidasMobiGo/rest/MidasMobiGoService/outPODPartDetail?ipcUserID=devatstbn&ipcPword=steve&ipcDocno=undefined&ipcType=CSR
                    //let podData = await (responseJS);

                    if(typeof(podData) != 'undefined'){

                        let dataIn = JSON.parse(podData.data.response.lcJson);
                        console.log(dataIn);
                        setDetails(dataIn);
                        setFullData(dataIn);
                        let updatedList: any[] = [];
                        dataIn.filter((item: IDetail) => {

                            let ttline = item["tt-line"];
                            let ttitem = item["tt-item"].trim();
                            let ttind = item["tt-ind"];
                            let ttqty = item["tt-qty"].trim();
                            let ttactqty = item["tt-actqty"].trim();
                            updatedList.push({"tt-line":ttline,"tt-item":ttitem,"tt-ind":ttind,"tt-qty":ttqty,"tt-actqty":ttactqty}); 
                        // console.log(updatedList);
                        
                        });

                        await AsyncStorage.removeItem("PartDetail");
                        await AsyncStorage.setItem("PartDetail",JSON.stringify(updatedList));

                        setIsLoading(false);
                    }else{
                        console.log('not me');            
                    }
                }


            }


        }catch(err: any){
            console.log(err);
            setError(err);
            setIsLoading(false);
        }
    }

    const fetchData = async(url: string) =>{
        try{
            const response = await fetch(url);
            const json = await response.json();
            setDetails(json.results);
            //console.log(json.results);
            setIsLoading(false);
        }catch(err: any){
            console.log(err);
            setError(err);
            setIsLoading(false);
        }
    }

    if(isLoading){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size={'large'} color="#5500dc" />
            </View>
        );
    }
    if(error){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>
                    Error in fetching the data ... Please check your internet connection!

                </Text>
            </View>
        );
    }
//{ backgroundColor: index % 2 === 0 ? '#333' : '#444'}[,{backgroundColor}]
    const RenderItem = ({item, index}: {item: IDetail; index:number}) => 
    {
        const backgroundColor = index % 2 === 0 ? '#222' : '#333';
        return (
            <View style={styles.row}>
                <Text style={[styles.cell,{maxWidth:'25%'}]}>{item['tt-line']}</Text>
                <Text style={[styles.cell,{maxWidth:'25%'}]}>{item['tt-item'].trim().toUpperCase()}</Text>
                <Text style={[styles.cell,{maxWidth:'25%'}]}>{item['tt-ind']}</Text>
                <Text style={[styles.cell,{maxWidth:'25%'}]}>{item['tt-actqty'].trim().toUpperCase()}</Text>
            </View>)
    }
                //  autoCapitaize="none"
return (
    <View style={styles.container}>
       
        <ScrollView horizontal={true} >      
            <View>
                <View style={[styles.header, {width:dimensions.window.width}]}>
                    <Text style={[styles.headerText,{minWidth:'25%'}] }>Line</Text>
                    <Text style={[styles.headerText,{minWidth:'25%'}]}>Item</Text>
                    <Text style={[styles.headerText,{minWidth:'25%'}]}>Qty</Text>
                    <Text style={[styles.headerText,{minWidth:'25%'}]}>Actual</Text>                    
                </View>

                <FlatList
                    data={details}

                    renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
                >

                </FlatList>
            </View>
        </ScrollView>
    </View>
    );
}
             //       keyExtractor = {(item, index) => index}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  headerTopBar:{
    backgroundColor: '#1f2a35',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 5,
      elevation:2,
      marginBottom:15,
      color:"#fff",
  },
  searchBox:{
    paddingHorizontal:20,
    paddingVertical:10,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:8,
    backgroundColor:'#fff',
    color:"red",
    flex:1,
  },
  header:{
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#555',
    //flex: 1,
  },
  headerText:{

    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  row:{
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    //width:'100%',
    
  },
  darkRow: {
    backgroundColor: '#222',
  },
  lightRow: {
    backgroundColor: '#1a1a1a',
  },
  cell:{
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    flexWrap: "wrap",
    borderRightWidth: 1,
    borderRightColor: '#555',
  }
});



export default Page;