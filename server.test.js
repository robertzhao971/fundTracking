const axios = require('axios');
const firebase = require('firebase');
const config = require('./firebaseConfig.json');
const testCredential = require('./credential.json');

firebase.initializeApp(config);

const getIdToken = async (email, password) =>{
  try{
    await firebase.auth().signInWithEmailAndPassword(email, password);
    let token = await firebase.auth().currentUser.getIdToken();
    return token;
  } catch(e){
    expect(true).toBe(false);
  }
}

test('provide no auth token', async () => {
  try{
    await axios.get('http://localhost:3000/apis/getFund');
  } 
  catch(error) {
      expect(error.message).toEqual('Request failed with status code 403');
  }
});

test('test apis', async () => {
  let idToken = await getIdToken(testCredential.email, testCredential.password);
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/',
    headers: {'Authorization': idToken}
  });
  try{
    await axiosInstance.get('http://localhost:3000/apis/getFund');
  } 
  catch(error) {
      expect(error.message).toEqual('Request failed with status code 500');
  }
  try{
    await axiosInstance.get('http://localhost:3000/apis/getHoldings?user1=M');
  } 
  catch(error) {
      expect(error.message).toEqual('Request failed with status code 500');
  }
  let response = await axiosInstance.get('apis/getHoldings?user=M');
  expect(response.data).toHaveProperty('RBF688');
  response = await axiosInstance.get('apis/getFund?fund=RBF688');
  expect(String(response.data)).toMatch(/[0-9]+\.?[0-9]{0,2}/);
});