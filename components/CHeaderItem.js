import React from "react";
import { Text, Pressable } from "react-native";

function CHeaderItem({ title, onPress}) {
    return (
        <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>{title}</Text>
        </Pressable>
    )
}

export default CHeaderItem;