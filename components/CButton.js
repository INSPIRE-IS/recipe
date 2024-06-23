import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import defaultStyles from "../config/styles";

function CButton({icon, title, onPress, color = "primary", marginRight = 0 }) {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: colors[color], marginRight }]}
      onPress={onPress}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    
    //width: "80%",
    marginVertical: 10,
    flexDirection:"row",
    justifyContent:"center",
    marginBottom:4,
    paddingLeft:4,
    paddingRight:4,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    //textTransform: "uppercase",
    fontWeight: "bold",
    paddingTop:3,
    paddingBottom:3,
  },
  icon: {
    color: colors.white,
    marginRight: 3,
    paddingTop:3,
    paddingBottom:3,
  },
});
// <MaterialCommunityIcons name= color={'white'} size= {35}    />
export default CButton;
