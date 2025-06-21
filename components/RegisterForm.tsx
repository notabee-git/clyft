import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { checkAndCreateUser } from './addUser';

export default function RegisterForm() {
  const router = useRouter();
  const recaptchaVerifier = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");

  const sendVerification = async () => {
    if (!phoneNumber.match(/^\+\d{10,}$/)) {
      alert("Please enter a valid phone number with country code (e.g. +91...)");
      return;
    }

    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const id = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current!
      );
      setVerificationId(id);
      alert("Verification code sent to your phone.");
    } catch (err: any) {
      console.error(err);
      alert("Failed to send verification code: " + err.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      alert("Phone authentication successful ✅");
      checkAndCreateUser();
      router.push("/Maps");
    } catch (err: any) {
      console.error(err);
      alert("Invalid verification code.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={auth.app.options}
          />

          <Text style={styles.headerText}>Phone Verification</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter phone number (+91...)"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TouchableOpacity style={styles.button} onPress={sendVerification}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter verification code"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.footer}>By continuing, you agree to our</Text>
            <Text style={styles.terms}>Terms of Use & Privacy Policy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  footerContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingBottom: 10,
  },
  footer: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  terms: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#000",
    marginTop: 4,
  },
});
