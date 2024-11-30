// AuthScreen.js
import React, { useState } from 'react'
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native'
import auth from '@react-native-firebase/auth'
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication'

const AuthScreen = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false) // Toggle between Sign-In and Sign-Up

  // Sign up with Email and Password
  const handleSignUp = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      )
      await userCredential.user.updateProfile({ displayName: username })
      console.log('User signed up:', userCredential)
    } catch (error) {
      console.error('Error during Sign-Up:', error.message)
    }
  }

  // Sign in with Email and Password
  const handleSignIn = async () => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      )
      console.log('User signed in:', userCredential)
    } catch (error) {
      console.error('Error during Sign-In:', error.message)
    }
  }

  // Sign in with Apple
  async function onAppleButtonPress() {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      })

      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned')
      }

      const { identityToken, nonce } = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      )

      const userCredential = await auth().signInWithCredential(appleCredential)
      console.log('User signed in with Apple:', userCredential)
    } catch (error) {
      console.error('Error during Apple Sign-In:', error)
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      {isSigningUp ? (
        <>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 200 }}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 200 }}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, padding: 8, marginBottom: 20, width: 200 }}
            secureTextEntry
          />
          <Button title="Sign Up" onPress={handleSignUp} />
          <TouchableOpacity onPress={() => setIsSigningUp(false)}>
            <Text style={{ marginTop: 20 }}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: 200 }}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, padding: 8, marginBottom: 20, width: 200 }}
            secureTextEntry
          />
          <Button title="Sign In" onPress={handleSignIn} />
          <TouchableOpacity onPress={() => setIsSigningUp(true)}>
            <Text style={{ marginTop: 20 }}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
          <AppleButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{ width: 160, height: 45, marginTop: 20 }}
            onPress={() =>
              onAppleButtonPress().then(() =>
                console.log('Apple sign-in complete!')
              )
            }
          />
        </>
      )}
    </SafeAreaView>
  )
}

export default AuthScreen
