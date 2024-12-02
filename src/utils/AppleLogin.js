// FILE: /app/auth/AppleLogin.js

import { appleAuth } from '@invertase/react-native-apple-authentication'
import auth from '@react-native-firebase/auth'

export async function onAppleButtonPress() {
  try {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    })

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identity token returned')
    }

    // Create a Firebase credential with the token
    const appleCredential = auth.AppleAuthProvider.credential(
      appleAuthRequestResponse.identityToken,
      appleAuthRequestResponse.nonce
    )

    // Sign the user in with the credential
    const userCredential = await auth().signInWithCredential(appleCredential)

    // Optionally, you can update the user's display name here
    if (appleAuthRequestResponse.fullName) {
      await userCredential.user.updateProfile({
        displayName: `${appleAuthRequestResponse.fullName.givenName} ${appleAuthRequestResponse.fullName.familyName}`,
      })
    }

    return userCredential.user
  } catch (error) {
    console.error('Error during Apple Sign-In:', error.message)
    throw error
  }
}
