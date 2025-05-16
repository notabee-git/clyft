import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";

// Define the screen names for routing
type ScreenName =
  | 'Orders'
  | 'Addresses'
  | 'Profile'
  | 'Support'
  | 'Refunds'
  | 'PaymentSettings'
  | 'ClyftCash'
  | 'Wallet'
  | 'Rewards'
  | 'GiftCards'
  | 'ReferEarn'
  | 'GSTDetails'
  | 'AboutUs'
  | 'FAQs'
  | 'Terms';

type FeatherIconName = keyof typeof Feather.glyphMap;

export default function AccountScreen() {
  const router = useRouter();
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);

  const yourInfoItems: { icon: FeatherIconName; text: string; route: ScreenName }[] = [
    { icon: 'package', text: 'Your Orders', route: 'Orders' },
    { icon: 'map-pin', text: 'Saved Addresses', route: 'Addresses' },
    { icon: 'user', text: 'Profile', route: 'Profile' },
    { icon: 'headphones', text: 'Help & Support', route: 'Support' },
    { icon: 'refresh-cw', text: 'Refunds', route: 'Refunds' },
    { icon: 'credit-card', text: 'Payment settings', route: 'PaymentSettings' },
    { icon: 'dollar-sign', text: 'Clyft Cash', route: 'ClyftCash' },
    { icon: 'briefcase', text: 'Wallet', route: 'Wallet' },
    { icon: 'award', text: 'Rewards', route: 'Rewards' },
    { icon: 'gift', text: 'Gift Cards', route: 'GiftCards' },
    { icon: 'share-2', text: 'Refer & Earn', route: 'ReferEarn' },
    { icon: 'file-text', text: 'GST Details', route: 'GSTDetails' },
  ];

  const otherInfoItems: { icon: FeatherIconName; text: string; route: ScreenName }[] = [
    { icon: 'info', text: 'About Us', route: 'AboutUs' },
    { icon: 'help-circle', text: 'FAQs', route: 'FAQs' },
    { icon: 'file', text: 'Terms, Policies and Licenses', route: 'Terms' },
  ];

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
            <Text style={styles.avatarText}>SP</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameEditRow}>
              <Text style={styles.profileName}>Sathwik Padigela</Text>
              <TouchableOpacity>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.profileEmail}>sathwikpadigela@gmail.com</Text>
            <Text style={styles.profilePhone}>8008687540</Text>
          </View>
        </View>

        <View style={styles.sectionGap} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/Cart')}>
            <Ionicons name="document-text-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Your {'\n'}Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/Cart')}>
            <Feather name="headphones" size={24} color="#333" />
            <Text style={styles.actionText}>Help & {'\n'}Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/Cart')}>
            <Feather name="dollar-sign" size={24} color="#333" />
            <Text style={styles.actionText}>Clyft {'\n'}Cash</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionGap} />

        {/* Language Section */}
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

        <View style={styles.sectionGap} />

        {/* Update Banner */}
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

        <View style={styles.sectionGap} />

        {/* Your Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Information</Text>
        </View>
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

        {/* Other Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Other Information</Text>
        </View>
        {otherInfoItems.map((item, index) => (
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
    </SafeAreaView>
  );
}

// Your existing StyleSheet remains unchanged


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