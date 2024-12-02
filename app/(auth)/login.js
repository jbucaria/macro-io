// FILE: /app/index.js

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppleButton } from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'
import { Stack } from 'expo-router'
import { onAppleButtonPress } from '@/src/utils/AppleLogin' // Import the Apple login function
import useStore from '@/src/store/useStore' // Import the Zustand store

const Index = () => {
  const [initializing, setInitializing] = useState(true)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false) // Toggle between Sign-In and Sign-Up

  const setUser = useStore(state => state.setUser)
  const clearUser = useStore(state => state.clearUser)

  // Handle user state changes
  function onAuthStateChanged(user) {
    if (user) {
      setUser({
        email: user.email,
        displayName: user.displayName,
        uid: user.uid,
      })
    } else {
      clearUser()
    }
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  // Sign up with Email and Password
  const handleSignUp = async () => {
    try {
      // Create user with email and password
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      )
      // Optionally, you can update the user's display name here
      await userCredential.user.updateProfile({ displayName: username })

      // console.log('User signed up:', userCredential)
      setUser({
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        uid: userCredential.user.uid,
      })
    } catch (error) {
      console.error('Error during Sign-Up:', error.message)
    }
  }

  // Sign in with Email and Password
  const handleSignIn = async () => {
    try {
      // Sign in the user with email and password
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      )
      // console.log('User signed in:', userCredential)
      setUser({
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        uid: userCredential.user.uid,
      })
    } catch (error) {
      console.error('Error during Sign-In:', error.message)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="w-full max-w-xs">
        <Text className="text-2xl font-bold mb-4">Login Page</Text>
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          className="border border-gray-300 rounded px-4 py-2 mb-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {isSigningUp ? (
          <Button title="Sign Up" onPress={handleSignUp} />
        ) : (
          <Button title="Sign In" onPress={handleSignIn} />
        )}
        <TouchableOpacity
          className="mt-4"
          onPress={() => setIsSigningUp(!isSigningUp)}
        >
          <Text className="text-blue-500">
            {isSigningUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
          </Text>
        </TouchableOpacity>
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: 160,
            height: 45,
            marginTop: 16,
          }}
          onPress={async () => {
            try {
              const user = await onAppleButtonPress()
              setUser({
                email: user.email,
                displayName: user.displayName,
                uid: user.uid,
              })
            } catch (error) {
              console.error('Error during Apple Sign-In:', error.message)
            }
          }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Index
