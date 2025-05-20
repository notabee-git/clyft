import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import {
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "../firebaseConfig";

export default function RegisterForm() {
  const router = useRouter();
  const recaptchaVerifier = useRef(null);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

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
      router.push("/StoreSelectionScreen");
    } catch (err: any) {
      console.error(err);
      alert("Invalid verification code.");
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <TouchableOpacity
          style={styles.continueButton}
          onPress={sendVerification}
        >
          <Text style={styles.continueText}>Send OTP</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.continueButton} onPress={confirmCode}>
          <Text style={styles.continueText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footer}>By continuing, you agree to our</Text>
        <Text style={styles.terms}>Terms of Use & Privacy Policy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  continueButton: {
    marginTop: 10,
    backgroundColor: "#444",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  continueText: {
    color: "#fff",
    fontSize: 18,
  },
  footerContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    width: "100%",
  },
  footer: {
    fontSize: 14,
    fontWeight: "bold",
  },
  terms: {
    fontSize: 14,
    fontStyle: "italic",
  },
});
