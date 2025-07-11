import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DashboardTab() {
  const [messageText, setMessageText] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');

  const handleSelectFiles = () => {
    // Handle file selection logic
    console.log('Select files clicked');
  };

  const handleUploadFirstDocument = () => {
    // Handle first document upload
    console.log('Upload first document clicked');
  };

  const handlePayOutsideBalance = () => {
    // Handle payment logic
    console.log('Pay outside balance clicked');
  };

  const handleSendMessage = () => {
    // Handle message sending
    console.log('Send message:', messageText);
    setMessageText('');
  };

  const handleSendAssistantMessage = () => {
    // Handle assistant message sending
    console.log('Send assistant message:', assistantMessage);
    setAssistantMessage('');
  };

  const handleScheduleAppointment = () => {
    // Handle appointment scheduling
    console.log('Schedule appointment clicked');
  };

  const handleSendMessageToOffice = () => {
    // Handle sending message to office
    console.log('Send message to office clicked');
  };

  return (
    <SafeAreaView style={styles.container}>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Dashboard Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeContent}>
            <View>
              <Text style={styles.welcomeSubtitle}>Welcome to Your</Text>
              <Text style={styles.welcomeTitle}>Dashboard</Text>
            </View>
            <View style={styles.welcomeIcons}>
              <Ionicons name="chatbubble-outline" size={24} color="#9CA3AF" />
              <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* Shared Document */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="document-text" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.cardTitle}>Shared Document</Text>
          </View>
          <Text style={styles.cardDescription}>
            Document shared with you by our legal team
          </Text>
        </View>

        {/* Document Upload */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="cloud-upload-outline" size={20} color="#6B7280" />
            </View>
            <Text style={styles.cardTitle}>Document Upload</Text>
          </View>
          
          <View style={styles.uploadArea}>
            <Ionicons name="cloud-upload-outline" size={48} color="#D1D5DB" />
            <Text style={styles.uploadTitle}>Upload document for your case</Text>
            <Text style={styles.uploadDescription}>
              Drag and drop files here or click to browse (PDF, DOC, XLSX & Images)
            </Text>
            
            <TouchableOpacity style={styles.selectFilesButton} onPress={handleSelectFiles}>
              <Ionicons name="attach-outline" size={16} color="#3B82F6" />
              <Text style={styles.selectFilesText}>Select Files</Text>
            </TouchableOpacity>
            
            <Text style={styles.encryptionText}>
              ⚡ 256-bit encryption ensures your documents are secure
            </Text>
          </View>
          
          <View style={styles.documentsSection}>
            <Text style={styles.documentsTitle}>Your Documents (0)</Text>
            
            <View style={styles.emptyDocuments}>
              <Ionicons name="document-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyDocumentsText}>No documents upload yet</Text>
              
              <TouchableOpacity 
                style={styles.uploadFirstButton} 
                onPress={handleUploadFirstDocument}
              >
                <Text style={styles.uploadFirstButtonText}>Upload Your First Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Billing & Invoices */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="card-outline" size={20} color="#6B7280" />
            </View>
            <Text style={styles.cardTitle}>Billing & Invoices</Text>
          </View>
          
          <View style={styles.balanceSection}>
            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceDate}>Last updated: March 1, 2024</Text>
              </View>
              <Text style={styles.balanceAmount}>$0</Text>
            </View>
            
            <Text style={styles.recentInvoicesText}>Recent Invoices</Text>
            
            <TouchableOpacity 
              style={styles.payButton} 
              onPress={handlePayOutsideBalance}
            >
              <Ionicons name="card" size={16} color="#ffffff" />
              <Text style={styles.payButtonText}>Pay Outside Balance</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Secure Messages */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="lock-closed" size={20} color="#6B7280" />
            </View>
            <Text style={styles.cardTitle}>Secure Messages</Text>
          </View>
          
          <View style={styles.encryptionBadges}>
            <View style={styles.encryptionBadge}>
              <Text style={styles.encryptionBadgeText}>AES-256 Encrypted</Text>
            </View>
            <View style={styles.encryptionBadge}>
              <Text style={styles.encryptionBadgeText}>End-to-End</Text>
            </View>
          </View>
          
          {/* Message from Dr. Beltran */}
          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>D</Text>
              </View>
              <View style={styles.messageInfo}>
                <Text style={styles.messageName}>Dr. Beltran</Text>
                <Text style={styles.messageContent}>
                  Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
                </Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>11:29 am</Text>
                  <View style={styles.encryptedBadge}>
                    <Text style={styles.encryptedBadgeText}>Encrypted</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Message from Margarito Alonzo */}
          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <View style={styles.messageAvatar}>
                <Text style={styles.messageAvatarText}>M</Text>
              </View>
              <View style={styles.messageInfo}>
                <Text style={styles.messageName}>Margarito Alonzo</Text>
                <Text style={styles.messageContent}>
                  Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
                </Text>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>11:24 am</Text>
                  <View style={styles.encryptedBadge}>
                    <Text style={styles.encryptedBadgeText}>Encrypted</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message..."
              value={messageText}
              onChangeText={setMessageText}
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Julia Legal Assistant */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="library-outline" size={20} color="#6B7280" />
            </View>
            <Text style={styles.cardTitle}>Julia Legal Assistant</Text>
          </View>
          
          {/* Assistant Messages */}
          <View style={styles.assistantMessage}>
            <View style={styles.assistantAvatar}>
              <Text style={styles.assistantAvatarText}>J</Text>
            </View>
            <View style={styles.assistantContent}>
              <Text style={styles.assistantText}>
                Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
              </Text>
              <View style={styles.assistantActions}>
                <TouchableOpacity 
                  style={styles.assistantButton} 
                  onPress={handleScheduleAppointment}
                >
                  <Text style={styles.assistantButtonText}>Schedule appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.assistantButton} 
                  onPress={handleSendMessageToOffice}
                >
                  <Text style={styles.assistantButtonText}>Send message to office</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.assistantMessage}>
            <View style={styles.assistantAvatar}>
              <Text style={styles.assistantAvatarText}>J</Text>
            </View>
            <View style={styles.assistantContent}>
              <Text style={styles.assistantText}>
                Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
              </Text>
            </View>
          </View>
          
          {/* Assistant Message Input */}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message..."
              value={assistantMessage}
              onChangeText={setAssistantMessage}
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendAssistantMessage}>
              <Ionicons name="send" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.assistantNote}>
            <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
            <Text style={styles.assistantNoteText}>
              Messages are forwarded directly to your attorney's office
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
});