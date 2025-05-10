import { View, StyleSheet } from 'react-native';
import Header from './Header';
import RegisterForm from './RegisterForm';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
