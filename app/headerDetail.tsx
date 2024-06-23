import { View, Text, Button,StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Details = () => {
    const {id,sector} = useLocalSearchParams<{id: string,sector: string}>();

    const [sectorS,setSectorS] = useState(""); 
    const [podNo,setPodNo] = useState(""); 
    const [podDate,setPodDate] = useState("");
    const [orderNo,setOrderNo] = useState("");
    const [accountNo,setAccountNo] = useState("");
    const [name,setName] = useState("");
    const [telephoneNumber,setTelephoneNumber] = useState("");
    const [deliveryAddress1,setDeliveryAddress1] = useState("");
    const [deliveryAddress2,setDeliveryAddress2] = useState("");
    const [deliveryAddress3,setDeliveryAddress3] = useState("");
    useEffect(()=>{
      setSectorS(sector);
      loadData();
  }, []);
  interface Item {
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

  const loadData = async ()=>{
    try{
      console.log('detail', id);
      const listItems = await AsyncStorage.getItem("ListItems");
      let listItem: any[] = [];
      if(listItems != undefined){
        //console.log(JSON.parse(listItem)); 
        const event = id.toLowerCase();
        const fullList = JSON.parse(listItems);

        fullList.filter((item : Item) => {
          let docno = item["tt-docno"].toLowerCase();
          let accno = item["tt-accno"].toLowerCase();
          let name = item["tt-name"].toLowerCase();
          let datecreated = item["tt-datecreated"].toLowerCase();
          let timecreated = item["tt-timecreated"].toLowerCase();

          //console.log(name.includes(event) + ' '+ name);
          //if(name.indexOf(event) !== -1){
          if(
              docno.includes(event) ||
              accno.includes(event) ||
              name.includes(event) ||
              datecreated.includes(event) ||
              timecreated.includes(event)
              
              ){
                //console.log(item);
                setPodNo(item["tt-docno"].trim()); 
                setPodDate(item["tt-datecreated"].trim() + ' ' + item["tt-timecreated"].trim());
                setOrderNo(item["tt-order"].trim());
                setAccountNo(item["tt-accno"].trim());
                setName(item["tt-name"].trim());
                setTelephoneNumber(item["tt-tel"].trim());
                setDeliveryAddress1(item["tt-addr1"].trim());
                setDeliveryAddress2(item["tt-addr2"].trim());
                setDeliveryAddress3(item["tt-addr3"].trim());
                listItem.push(item);
     
          }
      });
        await AsyncStorage.removeItem("ListItem");
        await AsyncStorage.setItem("ListItem",JSON.stringify(listItem));         
      }
    }catch(err){
        console.log(err);
    }
}

  return (

    
      <View style={styles.container } >
        <Text style={styles.text}>POD No : </Text>
        <Text style={[styles.text, {marginBottom:20}]}>{podNo}</Text>
        <Text style={styles.text}>POD DATE & TIME: </Text>
        <Text style={[styles.text, {marginBottom:20}]}>{podDate}</Text>
        <Text style={styles.text}>Order No : </Text>
        <Text style={[styles.text, {marginBottom:20}]}>{orderNo}</Text>
        <Text style={styles.text}>Account No : </Text>
        <Text style={[styles.text, {marginBottom:20}]}>{accountNo}</Text>
        <Text style={styles.text}>Name:</Text>
        <Text style={[styles.text, {marginBottom:20}]}>{name}</Text>
        <Text style={styles.text}>Telephone Number:</Text>
        <Text style={[styles.text, {marginBottom:20}]}>{telephoneNumber}</Text>
        <Text style={styles.text}>Delivery Address:</Text>
        <Text style={styles.text}>{deliveryAddress1}</Text>
        <Text style={styles.text}>{deliveryAddress2}</Text>
        <Text style={styles.text}>{deliveryAddress3}</Text>
      </View>
  )
}
{/* <View >
      <Text>Details {id} {sector}</Text>
      <Link href={{
            pathname:"/(drawer)/pod"
        }} replace asChild>
            <Button title='GO BACK' />
            </Link>

    </View> */}
    const styles = StyleSheet.create({
      container: {
        flex: 1, backgroundColor: '#111', padding: 20, alignItems: 'center',width:'100%'
      },
      text: {
        textAlign: 'center',
        color: '#fff',
      },
    });
export default Details