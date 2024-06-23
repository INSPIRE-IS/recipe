import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator,TextInput,Image,Dimensions } from 'react-native';
import React, { useEffect,useState } from 'react';

import axios from 'axios';
import {API_URL} from '../context/AuthAsyncStorageContext';
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
    //     //   const ipcUserID = 'devatstbn'; // or devatstbc
    //     //   const ipcPword = 'steve';
    //     //   const ipcType = "CSR";
   // const data =  await axios.get(`${API_URL}outPOD?ipcUserID=${ipcUserID}&ipcPword=${ipcPword}&ipcType=${ipcType}`);
    let podData = await (responseJS);

        if(typeof(podData) != 'undefined'){

            let dataIn = JSON.parse(podData.response.lcJson);
            console.log(dataIn);
            setDetails(dataIn);
            setFullData(dataIn);
            await AsyncStorage.removeItem("ItemDetail");
            await AsyncStorage.setItem("ItemDetail",JSON.stringify(dataIn));

            setIsLoading(false);
        }else{
            console.log('not me');            
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

    const handleSearch = (query: string) =>{
        setSearchQuery(query);
        // Name search query
        const event = query.toLowerCase();//.target.value;
        if(event.length >= 2){
            // Get all dataList
            let fullList = [...fullData];
            let updatedList: any[] = [];

            // Filter employee names by search query
            fullList.filter((item: IDetail) => {
                let docno = item["tt-docno"].toLowerCase();
                let ttline = item["tt-line"];
                let ttitem = item["tt-item"].toLowerCase();                                
                let ttind = item["tt-ind"];
                let ttqty = item["tt-qty"];
                let ttactqty = item["tt-actqty"].toLowerCase();

                console.log(ttitem.includes(event) + ' '+ ttitem);
                //if(name.indexOf(event) !== -1){
                if(
                    ttitem.includes(event) ||
                    ttqty.includes(event) ||
                    ttactqty.includes(event)
                    ){
                    updatedList.push(item);      
                }
            });
            setDetails(updatedList);
        }else{
            let fullList = [...fullData];
            setDetails(fullList);
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
            <Link href={{
                pathname:"/arrived",
                params:{id: item['tt-docno']}
            }} asChild>
            <View style={styles.row}>
                <Text style={[styles.cell,{width:'25%'}]}>{item['tt-line']}</Text>
                <Text style={[styles.cell,{width:'25%'}]}>{item['tt-item'].trim()}</Text>
                <Text style={[styles.cell,{width:'25%'}]}>{item['tt-ind']}</Text>
                <Text style={[styles.cell,{width:'25%'}]}>{item['tt-actqty'].trim()}</Text>
            </View>
        </Link>)
    }
                //  autoCapitaize="none"
return (
    <View style={styles.container}>
        <View style={styles.headerTopBar}>
            <TextInput 
                  style={styles.searchBox}
                  placeholder="Search by name"
                  clearButtonMode="always"

                  autoCorrect={false}
                  value={searchQuery}
                  onChangeText={(query) => handleSearch(query)}
                  >
            </TextInput>
        </View>
        
        <ScrollView horizontal={true} >      
            <View>
                <View style={[styles.header, {width:dimensions.window.width}]}>
                    <Text style={[styles.headerText,{width:'25%'}] }>Line</Text>
                    <Text style={[styles.headerText,{width:'25%'}]}>Item</Text>
                    <Text style={[styles.headerText,{width:'25%'}]}>Qty</Text>
                    <Text style={[styles.headerText,{width:'25%'}]}>Actual</Text>                    
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
  }
});



export default Page;