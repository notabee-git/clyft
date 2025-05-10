import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useFonts, OpenSans_400Regular, OpenSans_700Bold } from '@expo-google-fonts/open-sans';

export default function VerifyScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120); // 2 minutes
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep only latest digit
    setOtp(newOtp);

    // Move to next input automatically
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;
  const isComplete = otp.every(digit => digit !== '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <Text style={styles.subtitle}>
        We have sent you a 4 digit verification code on
      </Text>
      <Text style={styles.phone}>+91 8008687540</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(val) => handleChange(index, val)}
          />
        ))}
      </View>

      <Text style={styles.timer}>{formattedTime}</Text>

      <TouchableOpacity
        style={[styles.button, !isComplete && styles.buttonDisabled]}
        disabled={!isComplete}
        //
        onPress={() => router.push('/Homepage')}
      >
        <Text style={styles.buttonText}>Login/Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 14,
    color: '#666',
  },
  phone: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
  },
  timer: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001133',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#888',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonDisabled: {
    fontFamily: 'OpenSans_700Bold',
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
