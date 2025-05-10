import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebaseConfig"; // adjust path if needed

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleEmailChange = (text: string) => {
    setEmail(text.trim()); // optional: trim spaces
  };

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);

      alert("Verification email sent! Please verify your email.");
      router.push("/VerifyEmail"); // Navigate to loading screen
    } catch (error: any) {
      alert("Signup failed: " + error.message);
    }
  };

  const FunctSignin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential && userCredential.user) {
        if (userCredential.user.emailVerified) {
          alert("Login successful!");
          router.push("/StoreSelectionScreen"); // Navigate only if login is valid
        } else {
          alert("Login failed: Email not verified.");
        }
      } else {
        alert("Login failed: Invalid credentials.");
      }
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={FunctSignin}>
            <Text style={styles.continueText}>Signin</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footer}>By continuing, you agree to our</Text>
        <Text style={styles.terms}>Terms of Use & Privacy Policy</Text>
      </View>
    </View>
  );
}

// 👇 Add the styles below the component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // or 'center' if you want them close
    alignItems: "center",
    gap: 10, // optional for spacing between buttons
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
  },
  continueButton: {
    marginTop: 20,
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
