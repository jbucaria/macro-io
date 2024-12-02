import auth from '@react-native-firebase/auth'
import { LoginManager, AuthenticationToken } from 'react-native-fbsdk-next'
import { sha256 } from 'react-native-sha256'

async function onFacebookButtonPress() {
  // Create a nonce and the corresponding
  // sha256 hash of the nonce
  const nonce = '123456'
  const nonceSha256 = await sha256(nonce)
  // Attempt login with permissions and limited login
  const result = await LoginManager.logInWithPermissions(
    ['public_profile', 'email'],
    'limited',
    nonceSha256
  )

  if (result.isCancelled) {
    throw 'User cancelled the login process'
  }

  // Once signed in, get the users AuthenticationToken
  const data = await AuthenticationToken.getAuthenticationTokenIOS()

  if (!data) {
    throw 'Something went wrong obtaining authentication token'
  }

  // Create a Firebase credential with the AuthenticationToken
  // and the nonce (Firebase will validates the hash against the nonce)
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.authenticationToken,
    nonce
  )

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential)
}
