import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'

const index = () => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber // unsubscribe on unmount
  }, [])

  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
      // See: https://github.com/invertase/react-native-apple-authentication#faqs
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned')
    }

    // Create a Firebase credential from the response
    const { identityToken, nonce } = appleAuthRequestResponse
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    )

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential)
  }

  if (initializing) return null

  if (!user) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center ">
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={{
            width: 160,
            height: 45,
          }}
          onPress={() =>
            onAppleButtonPress().then(() =>
              console.log('Apple sign-in complete!')
            )
          }
        />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <Text>Welcome {user.email}</Text>
      <TouchableOpacity onPress={() => auth().signOut()}>
        <Text>Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default index
