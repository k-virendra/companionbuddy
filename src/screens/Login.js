import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ToastAndroid
} from 'react-native';
import { colors } from '../constants/theme';
import { connect, useDispatch } from 'react-redux';
import { login } from '../redux/actions/auth';
import auth from '@react-native-firebase/auth';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useNavigation } from '@react-navigation/native';

const Login = props => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [state, setState] = useState({
    email: '',
    password: ''
  });
// If null, no SMS has been sent
const [confirm, setConfirm] = useState(null);
const [user, setUser] = useState();

// Handle user state changes
function onAuthStateChanged(user) {
  console.log("USER", user);
  dispatch({type: REGISTER_SUCCESS, payload: user});
  setUser(user);
}

useEffect(() => {
  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  return subscriber; // unsubscribe on unmount
}, []);
// Handle the button press
async function signInWithPhoneNumber() {
  const confirmation = await auth().signInWithPhoneNumber(state.email);
  console.log("comfirm", confirmation);
  setConfirm(confirmation);
}

async function confirmCode() {
  try {
    await confirm.confirm(state.password);
  } catch (error) {
    Toast.show({type: "error", text1: 'Invalid code'})
    console.log('Invalid code.');
  }
}
 
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.container}>
        <View>
          <Image
            source={require('../../assets/yoga_main.jpg')}
            style={{
              width: Dimensions.get('screen').width,
              height: Dimensions.get('screen').width
            }}
          />
        </View>
        <View style={styles.signUpContainer}>
          <Text style={styles.headerText}>Login</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Phone Number with Country Code'}
            value={state.email}
            editable={!confirm && true}
            onChangeText={text => {
              setState({
                ...state,
                email: text
              });
            }}
          />
          {confirm && <TextInput
            style={styles.textInput}
            keyboardType='number-pad'
            placeholder={'OTP'}
            value={state.password}
            onChangeText={text => {
              setState({
                ...state,
                password: text
              });
            }}
            // secureTextEntry={true}
          />}
          {/* <TouchableOpacity onPress={() => props.navigation.navigate('SignUp')}>
            <Text style={styles.already}>Don't have an account?</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={confirm ? confirmCode : signInWithPhoneNumber}>
            <View style={styles.submitButton}>
              <Text style={styles.submitText}>{confirm ? "Submit OTP ": "Send OTP"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default connect(null, { login })(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 100,
    backgroundColor: colors.white
  },
  signUpContainer: {
    backgroundColor: colors.white,
    flex: 1,
    position: 'relative',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    top: -10
  },
  textInput: {
    backgroundColor: colors.accent,
    margin: 10,
    height: 40,
    borderRadius: 30,
    elevation: 1,
    padding: 10,
    color: colors.black
  },
  radioButton: {
    flexDirection: 'row',
    paddingLeft: 20
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  submitButton: {
    alignSelf: 'center',
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.yellow,
    height: 40,
    borderRadius: 60
  },
  submitText: {
    color: colors.white,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 2
  },
  headerText: {
    color: colors.secondary,
    fontSize: 40,
    textTransform: 'uppercase',
    padding: 10,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  already: {
    alignSelf: 'flex-end',
    paddingRight: 20,
    paddingBottom: 10,
    color: colors.secondary
  }
});
