import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator,TextInput,Image, Pressable } from 'react-native';
import React, { useEffect,useState } from 'react';

import axios from 'axios';
import {API_URL, useAuth} from '../../context/AuthAsyncStorageContext';
import responseJS from '../../assets/responsePOD.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, router } from 'expo-router';
import { RefreshControl } from 'react-native-gesture-handler';
const API_SEARCH = 'https:randomuser.me/api/?results=30';
const API_Data = 'https:randomuser.me/api/?results=30';
const Page = () => {
    const { authState,onUpdate,onLogout } = useAuth();
    const [pods,setPods] = useState<IItem[]>([]); // {ipcUserID: null,ipcPword: null,tt_br: null,cType: null};
    const [isLoading,setIsLoading] = useState(false);
    const [dataS,setDataS] = useState<IItem[]>([]);
    const [error,setError] = useState("");
    const [fullData,setFullData] = useState<IItem[]>([]);
    const [searchQuery,setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(true);

    interface IItem {
        "tt-accno": string;
        "tt-addr1": string;
        "tt-addr2": string;
        "tt-addr3": string;
        "tt-datecreated": string;
        "tt-datentime": string;
        "tt-deliver": string;
        "tt-docno": string;
        "tt-fnbaccno": string;
        "tt-invtype": string;
        "tt-name": string;
        "tt-order": string;
        "tt-regno": string;
        "tt-tel": string;
        "tt-timecreated": string;
        "tt-vendor": string;
        "tt-wsale": string;
      }
    useEffect(()=>{
        setIsLoading(true);
        //fetchData(API_SEARCH);  
        
            loadData();
    }, []);



    const loadData = async ()=>{
        try{
            await onUpdate!("CSR");
            const user = authState;                
            console.log('user', user)
            //const authUser = await AsyncStorage.getItem(AUTH_STATE);
            if(user != undefined){
                if(user.ipcUserID == undefined || user.ipcPword == undefined || user.tt_br == ""){
                    console.log('broken');
                    user.authenticated = false;
                    setRefreshing(false);
                    setIsLoading(false);
                    await onLogout!();
                    return setError("Error: User Not Authenticated! Logout then Login");
                }
                //const user = authUser; //JSON.parse(authUser);
                    
                setPods([]);
                const ipcUserID = user.ipcUserID; // 'devatstbn'; // or devatstbc
                const ipcPword = user.ipcPword; // 'steve';
                const ipcType = "CSR";// user.cType; //
                const url = `${API_URL}outPOD?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}&ipcType=${ipcType}`;
                console.log(url);
                const podData =  await axios.get(url);
                //console.log(podData);
                //let podData = await (responseJS);

                if(typeof(podData) != 'undefined'){

                    let dataIn: IItem[] = JSON.parse(podData.data.response.lcJson);
                    //console.log(dataIn);
                    let updatedList: any[] = [];

                    // Filter employee names by search query
                    dataIn.filter((item: IItem) => {

                        let docno = item["tt-docno"].toUpperCase();
                        let accno = item["tt-accno"].toUpperCase();
                        let name = item["tt-name"].toUpperCase();
                        let datecreated = item["tt-datecreated"].toUpperCase();
                        let timecreated = item["tt-timecreated"].toUpperCase();

                        updatedList.push({"tt-docno":docno,"tt-accno":accno,"tt-name":name,"tt-datecreated":datecreated,"tt-timecreated":timecreated}); 
                    // console.log(updatedList);
                    
                    });
                    //console.log(updatedList);
                    setPods(updatedList);
                    setFullData(updatedList);
                    await AsyncStorage.removeItem("ListItems");
                    await AsyncStorage.setItem("ListItems",JSON.stringify(dataIn));
                    setRefreshing(false);
                    setIsLoading(false);
            }
            
        }else{
            console.log('not auth');            
        }

        }catch(err: any){
            console.log(err);
            setError('Error in fetching the data ... Please check your internet connection!');
            setIsLoading(false);
            setRefreshing(false);
        }
    }

    const fetchData = async(url: string) =>{
        try{
            const response = await fetch(url);
            const json = await response.json();
            setDataS(json.results);
            //console.log(json.results);
            setIsLoading(false);
        }catch(err: any){
            console.log(err);
            setError('Error in fetching the data ... Please check your internet connection!');
            setIsLoading(false);
        }
    }

    const handleSearch = (query: string) =>{
        setSearchQuery(query);
        // Name search query
        const event = query.toLowerCase();//.target.value;
        if(event.length >= 2){
            // Get all dataList
            let fullList = [...fullData];
            let updatedList: any[] = [];

            // Filter employee names by search query
            fullList.filter((item: IItem) => {
                let docno = item["tt-docno"].toUpperCase();
                let accno = item["tt-accno"].toUpperCase();
                let name = item["tt-name"].toUpperCase();
                let datecreated = item["tt-datecreated"].toUpperCase();
                let timecreated = item["tt-timecreated"].toUpperCase();

                // console.log(name.includes(event) + ' '+ name);
                //if(name.indexOf(event) !== -1){
                if(
                    docno.includes(event) ||
                    accno.includes(event) ||
                    name.includes(event) ||
                    datecreated.includes(event) ||
                    timecreated.includes(event)
                    
                    ){
                        
                    updatedList.push({"tt-docno":docno,"tt-accno":accno,"tt-name":name,"tt-datecreated":datecreated,"tt-timecreated":timecreated});      
                }
            });
            setPods(updatedList);
        }else{
            let fullList = [...fullData];
            setPods(fullList);
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
            <View style={{flex:1, justifyContent:'center', alignItems:'center', width:'100%',backgroundColor:'black'}}>
                <Text style={{color:'red',flexWrap:"wrap",width:'80%'}}>
                    
                    {error}
                </Text>
            </View>
        );
    }
//{ backgroundColor: index % 2 === 0 ? '#333' : '#444'}[,{backgroundColor}].replace(/^\s+|\s+$/gm,'')
    const RenderItem = ({item, index}: {item: IItem; index:number}) => 
    {
        const backgroundColor = index % 2 === 0 ? '#222' : '#333';
        return (
            <Pressable
            onPress={()=> router.push({pathname:"/detail", params:{id: item['tt-docno'],sector:'itr'}})}
           >

            <View style={styles.row}>

                <Text style={[styles.cell]}>{item['tt-docno'].trim()}</Text>
                <Text style={[styles.cell]}>{item['tt-accno'].trim()}</Text>
                <Text style={[styles.cell]}>{item['tt-name'].trim()}</Text>
                <Text style={[styles.cell]}>{item['tt-datecreated'].trim()}</Text>
                <Text style={[styles.cell]}>{item['tt-timecreated'].trim()}</Text>
            </View>
            </Pressable>
        )
    }
    const ItemSeparatorView = () => {
        return (
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#C8C8C8',
            }}
          />
        );
      };

                //  
return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <TextInput 
                  style={styles.searchBox}
                  placeholder="Search by name"
                  clearButtonMode="always"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={searchQuery}
                  onChangeText={(query) => handleSearch(query)}
                  >
            </TextInput>
        </View>
        
        <ScrollView horizontal={true} >      
            <View>
                <View style={styles.header}>
                    <Text style={[styles.headerText] }>POD No.</Text>
                    <Text style={[styles.headerText]}>Account No.</Text>
                    <Text style={[styles.headerText]}>Name</Text>
                    <Text style={[styles.headerText]}>Date Created</Text>
                    <Text style={[styles.headerText]}>Time Created</Text>
                    
                </View>
                {refreshing ? <ActivityIndicator /> : null}
                <FlatList
                    data={pods}
                    ItemSeparatorComponent={ItemSeparatorView}

                    renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
                      }
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
    paddingHorizontal:10,
    paddingVertical:5,
    borderColor:'#ccc',
    borderWidth:1,
    borderRadius:3,
    backgroundColor:'#fff',
    color:"#A9A9A9",
    fontSize: 16, 
  },
  header:{
    flexDirection: 'row',
    backgroundColor: '#111',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width:'100%'
  },
  headerText:{
    flex: 1,
    paddingHorizontal:2,
    paddingVertical:2,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#555',
    minWidth:'20%',
    maxWidth:'20%',
    flexWrap: "wrap",
  },
  row:{
    flexDirection: 'row',

    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    width:'100%'
  },
  darkRow: {
    backgroundColor: '#222',
  },
  lightRow: {
    backgroundColor: '#1a1a1a',
  },
  cell:{
    flex: 1,
    paddingHorizontal:2,
    paddingVertical:2,
    color: '#fff',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#555',
    minWidth:'20%',
    maxWidth:'20%',
    flexWrap: "wrap",
  }
});



export default Page;