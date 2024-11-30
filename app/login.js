import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Button,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'

const Index = () => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false) // Toggle between Sign-In and Sign-Up

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user)
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

      console.log('User signed up:', userCredential)
      setUser(userCredential.user)
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
      console.log('User signed in:', userCredential)
      setUser(userCredential.user)
    } catch (error) {
      console.error('Error during Sign-In:', error.message)
    }
  }

  // Sign in with Apple
  async function onAppleButtonPress() {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      })

      console.log('Apple Auth Response:', appleAuthRequestResponse)

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned')
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      )

      console.log('Firebase Apple Credential:', appleCredential)

      // Sign the user in with the credential
      const userCredential = await auth().signInWithCredential(appleCredential)
      console.log('Firebase User Credential:', userCredential)

      // Set user manually in state
      if (userCredential && userCredential.user) {
        setUser(userCredential.user)
        console.log('User signed in:', userCredential.user)
      }
    } catch (error) {
      console.error('Error during Apple Sign-In:', error)
    }
  }

  // If the user is initializing, return null
  if (initializing) return null

  // If the user is not signed in, show the sign-up and sign-in options
  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        {isSigningUp ? (
          <>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={{
                borderWidth: 1,
                padding: 8,
                marginBottom: 10,
                width: 200,
              }}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                padding: 8,
                marginBottom: 10,
                width: 200,
              }}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1,
                padding: 8,
                marginBottom: 20,
                width: 200,
              }}
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
              style={{
                borderWidth: 1,
                padding: 8,
                marginBottom: 10,
                width: 200,
              }}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={{
                borderWidth: 1,
                padding: 8,
                marginBottom: 20,
                width: 200,
              }}
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
              style={{
                width: 160,
                height: 45,
                marginTop: 20,
              }}
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

  // If the user is signed in, show the welcome screen
  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>Welcome {user.displayName ? user.displayName : user.email}</Text>
      <TouchableOpacity
        onPress={() =>
          auth()
            .signOut()
            .then(() => setUser(null))
        }
      >
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Index
