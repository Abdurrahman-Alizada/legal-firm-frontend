import CalendarTab from '@/components/client/CalendarTab';
import DashboardTab from '@/components/client/DashboardTab';
import DocumentsTab from '@/components/client/DocumentsTab';
import MessagesTab from '@/components/client/MessagesTab';
import { useAuthStore } from '@/services/authStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { colors } from '../../constants';

export default function ClientPortalScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {logout}=useAuthStore()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text.secondary} onPress={logout}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Client Portal</Text>
        <View style={styles.profileContainer}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={20} color={colors.primaryLight} />
          </View>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabBarItem, activeTab === 'dashboard' && styles.tabBarItemActive]} onPress={() => setActiveTab('dashboard')}>
          <Ionicons name="person-outline" size={24} color={activeTab === 'dashboard' ? colors.primary : colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBarItem, activeTab === 'documents' && styles.tabBarItemActive]} onPress={() => setActiveTab('documents')}>
          <Ionicons name="document-outline" size={24} color={activeTab === 'documents' ? colors.primary : colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBarItem, activeTab === 'messages' && styles.tabBarItemActive]} onPress={() => setActiveTab('messages')}>
          <Ionicons name="mail-outline" size={24} color={activeTab === 'messages' ? colors.primary : colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBarItem, activeTab === 'calendar' && styles.tabBarItemActive]} onPress={() => setActiveTab('calendar')}>
          <Ionicons name="calendar-outline" size={24} color={activeTab === 'calendar' ? colors.primary : colors.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'documents' && <DocumentsTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'calendar' && <CalendarTab />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  welcomeIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickActionItem: {
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 44,
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginVertical: 16,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  selectFilesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  selectFilesText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginLeft: 4,
  },
  encryptionText: {
    fontSize: 12,
    color: '#6B7280',
  },
  documentsSection: {
    marginTop: 16,
  },
  documentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  emptyDocuments: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyDocumentsText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  uploadFirstButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  uploadFirstButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  balanceSection: {
    marginTop: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  balanceDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  recentInvoicesText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  encryptionBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  encryptionBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  encryptionBadgeText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369A1',
  },
  messageInfo: {
    flex: 1,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  encryptedBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  encryptedBadgeText: {
    fontSize: 10,
    color: '#0369A1',
    fontWeight: '500',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    minHeight: 20,
  },
  sendButton: {
    marginLeft: 8,
  },
  assistantMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  assistantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  assistantContent: {
    flex: 1,
  },
  assistantText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  assistantActions: {
    flexDirection: 'row',
    gap: 8,
  },
  assistantButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  assistantButtonText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },
  assistantNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  assistantNoteText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBarItem: {
    padding: 8,
  },
  tabBarItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
});