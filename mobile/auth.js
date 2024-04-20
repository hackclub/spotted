// https://github.com/gorails-screencasts/oauth-api-authentication/blob/master/expo-react-native-client/auth.js

import * as SecureStore from 'expo-secure-store';
import * as AuthSession from 'expo-auth-session';

import { post, ENDPOINT } from './network';

const APP_ID = 'jPQoX0dOXmPdjW2Rna6Y0RfA0zQ29s6ny_9ZZcUNzEI';
const TOKEN_KEY = 'token';
export var token;

export const isLoggedIn = () => {
  return SecureStore.getItem(TOKEN_KEY) == null ? false : true;
};

export const login = async () => {
  let redirectUrl = AuthSession.getRedirectUrl();
  console.log(redirectUrl)
  let result = await AuthSession.startAsync({
    authUrl:
    `${ENDPOINT}/oauth/authorize?response_type=code` +
    `&client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
  });

  return new Promise((resolve, reject) => {
    post("/oauth/token", {
      grant_type: 'authorization_code',
      code: result.params.code,
      client_id: APP_ID,
      redirect_uri: redirectUrl,
    })
      .then((json) => {
        if (json.access_token) {
          SecureStore.setItemAsync(TOKEN_KEY, json.access_token)
          token = json.access_token
          resolve(true)
        } else {
          reject(json.error)
        }
      })
      .catch(err => reject(err));
  });
}

export const logout = () => {
  SecureStore.deleteItemAsync(TOKEN_KEY);
  token = null
}
