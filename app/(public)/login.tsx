import { StyleSheet, Text, View, Image,Button,TextInput, ActivityIndicator } from 'react-native';
import React, {useState} from 'react';
import { useAuth } from '../../context/AuthAsyncStorageContext';


import { MaterialCommunityIcons } from '@expo/vector-icons';
import CButton from '../../components/CButton';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {onLogin} = useAuth();
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const [error,setError] = useState<string>(""); 
    const login = async () =>{
      try {
        setIsLoading(true);
        const result = await onLogin!(email, password);
        
        if(result && result.error){
          //await setActive({ session: completeSignIn.createdSessionId });
            alert(result.msg);
            setIsLoading(false);
        }
      } catch (err: any) {
        alert(err.errors[0].message);
      } finally {
        setIsLoading(false);
        //setLoading(false);
      }

    };
    if(isLoading){
      return(
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator size={'large'} color="#5500dc" />
          </View>
      );
  }
  if(error != ''){
      return(
          <View style={{flex:1, justifyContent:'center', alignItems:'center', width:'100%',backgroundColor:'black'}}>
              <Text style={{color:'red',flexWrap:"wrap",width:'80%'}}>
                  
                  {error}
              </Text>
          </View>
      );
  }
  return (
    <View style={styles.container}>
      <View style= {{height:'100%'}}>
      <Image source={ require("../../assets/midas-logo.png") } style={styles.image1} ></Image>
        <View style={ styles.form}>
          <View style={{backgroundColor:'#fe6519',width:40, padding: 3, borderRadius: 100}}>
            <MaterialCommunityIcons name="account-outline" color={'white'} size= {35}    />
          </View>
          
          <Text style={ styles.headertext} >Login to Your Account</Text>
          <TextInput style={ styles.input} autoCapitalize='none' autoCorrect={false} placeholder='Email' onChangeText={(text:string) => setEmail(text)} value={email}></TextInput>
          <TextInput style={ styles.input} autoCapitalize='none' autoCorrect={false} placeholder='Password' secureTextEntry={true} onChangeText={(text:string) => setPassword(text)} value={password}></TextInput>
          <View style={ styles.login}>
            <CButton icon={"login-variant"}   onPress={login} title='Login' />
          </View>
        </View>
        <Image source={ require("../../assets/pb-elcb.png") } style={styles.image2} ></Image>
        <Text>Version: 1.0.2</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    width:'100%',
    height:'100%',
    justifyContent: 'center',
  },
  image1:{
    marginTop: 144,
    width:'auto',
    height:'10%',
    resizeMode:'contain',
    //backgroundColor: '#343e60',
    borderWidth: 2, 
    borderColor: '#fff', 
    // borderBottomColor: '#fe6519', 
    //borderStyle:'solid',
    marginBottom:2,
  },
  image2:{
    width: 'auto',
    height:'10%',
    resizeMode:'contain',
    //backgroundColor: '#343e20',
  },
  form:{
      gap:10,
      width:200,
      // height: '100%',
      backgroundColor: '#343e48'
      //,flex: 1, display: 'flex'
      , alignItems: 'center', justifyContent: 'center',
      paddingTop:8
  },
  input: {
    width:'100%',
    height:44,
    borderWidth:1,
    borderRadius:4,
    padding:10,
    backgroundColor:'#fff'

  },
  headertext: {
    color:'#fff',
    fontSize: 15,
    //flexDirection:"row",
    //justifyContent:"center"

  },
  login:{
    width:'100%',
    height:44,
    backgroundColor: '#444',
    margin:5
  }

});

export default Login;