import { View, Text } from 'react-native'
import React, {useState, useCallback} from 'react'
import { Pressable ,PressableProps} from 'react-native'
import { types } from '@babel/core'

interface safePressableProp extends Omit<PressableProps, 'onPress'> {
    onPress: () => void
    children?: React.ReactNode
    debunceTime?: number

} 
const SafePressable:React.FC<safePressableProp>=({onPress,children,debunceTime=500,style,...props})=> {
    const [isPressed, setIsPressed] = useState(false)
    const handlePress = useCallback(() => {
        if (!isPressed) {
            setIsPressed(true)
            onPress?.()
        }
        setTimeout(() => {
            setIsPressed(false)
        },debunceTime)
    },[isPressed,onPress,debunceTime])
  
    return (
        <Pressable
            onPress={handlePress}
            style={style}
            {...props}>
           {children} 
            </Pressable>
  )
}
export default SafePressable;
