import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput, Alert, Animated, Dimensions, PanResponder } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define the screen names as a union type for type safety
type ScreenName = '/your-orders' | '/Saved-Address' | '/profile' | '/help-and-support' | '/refunds' | '/paymentSettings' | '/clyftCash' | '/wallet' | '/rewards' | '/giftCards' | '/referEarn' | '/GSTDetails' | '/AboutUs' | '/FAQs' | '/Terms';

type FeatherIconName = keyof typeof Feather.glyphMap;


// Profile Access Modal Component
const ProfileAccessModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  phoneNumber?: string;
}> = ({ visible, onClose, phoneNumber = '+918008687540' }) => {


  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  useEffect(() => {
    if (visible) {
      // Animate modal up
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Animate modal down
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (timeLeft > 0 && visible) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft, visible]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setOtp('');
      setTimeLeft(300);
      setIsResendEnabled(false);
    }
  }, [visible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmOTP = () => {
    if (otp.length < 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP');
      return;
    }
    
    // Simulate OTP verification
    Alert.alert('Success', 'Profile access granted!', [
      { text: 'OK', onPress: () => router.push('/update-profile') }
    ]);
  };

  const handleResendOTP = () => {
    if (isResendEnabled) {
      setTimeLeft(300);
      setIsResendEnabled(false);
      setOtp('');
      Alert.alert('OTP Resent', 'A new OTP has been sent to your phone');
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <TouchableOpacity 
          style={modalStyles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <Animated.View 
          style={[
            modalStyles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Drag Handle */}
          <View style={modalStyles.dragHandle} />
          
          <View style={modalStyles.content}>
            <View style={modalStyles.otpContainer}>
              <Text style={modalStyles.otpTitle}>Enter OTP to Access Profile</Text>
              <Text style={modalStyles.phoneText}>
                OTP sent to <Text style={modalStyles.phoneNumber}>{phoneNumber}</Text>
              </Text>
              
              <View style={modalStyles.inputContainer}>
                <TextInput
                  style={modalStyles.input}
                  placeholder="OTP"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={4}
                  autoFocus
                />
                <TouchableOpacity
                  style={[
                    modalStyles.resendButton,
                    !isResendEnabled && modalStyles.resendButtonDisabled
                  ]}
                  onPress={handleResendOTP}
                  disabled={!isResendEnabled}
                >
                  <Text style={[
                    modalStyles.resendText,
                    !isResendEnabled && modalStyles.resendTextDisabled
                  ]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={modalStyles.validityText}>
                Valid for {isResendEnabled ? '0:00' : formatTime(timeLeft)} mins
              </Text>
              
              <TouchableOpacity
                style={modalStyles.confirmButton}
                onPress={handleConfirmOTP}
              >
                <Text style={modalStyles.confirmButtonText}>Confirm OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default function AccountScreen() {

  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();


  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [showProfileAccess, setShowProfileAccess] = useState(false);

  // Menu items for "Your Information" - now with proper typing
  const yourInfoItems: { icon: FeatherIconName; text: string; route: ScreenName }[] = [
    { icon: 'package', text: 'Your Orders', route: '/your-orders' },
    { icon: 'map-pin', text: 'Saved Addresses', route: '/Saved-Address' },
    { icon: 'user', text: 'Profile', route: '/profile' },
    { icon: 'headphones', text: 'Help & Support', route: '/help-and-support' },
    { icon: 'refresh-cw', text: 'Refunds', route: '/refunds' },
    { icon: 'credit-card', text: 'Payment settings', route: '/paymentSettings' },
    { icon: 'dollar-sign', text: 'Clyft Cash', route: '/clyftCash' },
    { icon: 'briefcase', text: 'Wallet', route: '/wallet' },
    { icon: 'award', text: 'Rewards', route: '/rewards' },
    { icon: 'gift', text: 'Gift Cards', route: '/giftCards' },
    { icon: 'share-2', text: 'Refer & Earn', route: '/referEarn' },
    { icon: 'file-text', text: 'GST Details', route: '/GSTDetails' },
  ];

  // Menu items for "Other Information" - now with proper typing
  const otherInfoItems: { icon: FeatherIconName; text: string; route: ScreenName }[] = [
    { icon: 'info', text: 'About Us', route: '/AboutUs' },
    { icon: 'help-circle', text: 'FAQs', route: '/FAQs' },
    { icon: 'file', text: 'Terms, Policies and Licenses', route: '/Terms' },
  ];

  
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;

        if (!user) return;

        try {
          console.log('Fetching profile for UID:', user.uid);

          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('User data fetched:', data);
            setUserData(data);
          } else {
            console.warn('⚠️ No such user document in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }, [])
  );

  const handleEditProfile = () => {
    setShowProfileAccess(true);
  };

  const handleCloseProfileAccess = () => {
    setShowProfileAccess(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Account</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData?.firstName?.[0] ?? ''}{userData?.lastName?.[0] ?? ''}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameEditRow}>
              <Text style={styles.profileName}>
                {userData?.firstName} {userData?.lastName}
              </Text>
              <TouchableOpacity onPress={() => router.push('/update-profile')}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileEmail}>{userData?.email}</Text>
            <Text style={styles.profilePhone}>{userData?.contact}</Text>
            </View>
          </View>

        {/* Gap */}
        <View style={styles.sectionGap} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/your-orders')}>
            <Ionicons name="document-text-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Your {'\n'}Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/help-and-support')}>
            <Feather name="headphones" size={24} color="#333" />
            <Text style={styles.actionText}>Help & {'\n'}Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/clyftCash')}>
            <Feather name="dollar-sign" size={24} color="#333" />
            <Text style={styles.actionText}>Clyft {'\n'}cash</Text>
          </TouchableOpacity>
        </View>

        {/* Language Section */}
        <View style={styles.sectionGap} />
        <View style={styles.languageSection}>
          <Text style={styles.languageTitle}>Try Clyft in your language</Text>
          <View style={styles.languageOptions}>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageText}>Hindi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton}>
              <Text style={styles.languageText}>Telugu</Text>
            </TouchableOpacity>

            {!showMoreLanguages ? (
              <TouchableOpacity onPress={() => setShowMoreLanguages(true)}>
                <Text style={styles.moreText}>More</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.languageButton}>
                  <Text style={styles.languageText}>Bengali</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMoreLanguages(false)}>
                  <Text style={styles.moreText}>Less</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Update Banner */}
        <View style={styles.sectionGap} />
        <View style={styles.updateBanner}>
          <View style={styles.updateContent}>
            <Ionicons name="cloud-upload-outline" size={24} color="#333" />
            <View style={styles.updateTextContainer}>
              <Text style={styles.updateTitle}>Update Available</Text>
              <Text style={styles.updateDescription}>Shop smoother and easier than ever</Text>
            </View>
          </View>
          <View style={styles.newBadgeContainer}>
            <Text style={styles.newBadge}>NEW</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </View>

        {/* Your Information Section */}
        <View style={styles.sectionGap} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Information</Text>
        </View>
        <View>
          {yourInfoItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemContent}>
                <Feather name={item.icon} size={20} color="#333" />
                <Text style={styles.menuItemText}>{item.text}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Information Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Other Information</Text>
        </View>
        <View>
          {otherInfoItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(`/${item.route}`)}
            >
              <View style={styles.menuItemContent}>
                <Feather name={item.icon} size={20} color="#333" />
                <Text style={styles.menuItemText}>{item.text}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#888" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText1}>CLYFT</Text>
          <Text style={styles.footerText2}>v20.07.1</Text>
        </View>
      </ScrollView>

      {/* Profile Access Modal */}
      <ProfileAccessModal
        visible={showProfileAccess}
        onClose={handleCloseProfileAccess}
        phoneNumber="+918008687540"
      />
    </SafeAreaView>
  );
}

// Note: You'll need to add the StyleSheet definitions for the styles used above
// The modalStyles and styles objects are referenced but not defined in the original code

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
  },
  sectionGap: {
    height: 16,
    backgroundColor: 'transparent',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F0F4F7',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 80,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  nameEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    color: 'red',
    fontSize: 14,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionItem: {
    alignItems: 'center',
    width: '27%',
    backgroundColor: '#EFEFEF',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  languageSection: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  languageTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  languageOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#e8e8e8',
    marginBottom: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#333',
  },
  moreText: {
    fontSize: 14,
    color: 'red',
    marginLeft: 8,
  },
  updateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f9f9f9',
  },
  updateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  updateTextContainer: {
    marginLeft: 12,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  updateDescription: {
    fontSize: 12,
    color: '#666',
  },
  newBadgeContainer: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  newBadge: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a3a2a2',
  },
  footerText2: {
    fontSize: 10,
    color: '#a3a2a2',
  },
});

// Modal styles
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: SCREEN_HEIGHT * 0.45,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  otpContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 30,
    marginTop: 20,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  phoneText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  phoneNumber: {
    color: '#000',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  resendButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#999',
  },
  validityText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 30,
  },
  confirmButton: {
    backgroundColor: '#000',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});