import { TabHeader } from '@/components/ui/Headers';
import { colors } from '@/constants';
import { useAuthStore } from '@/services/authStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const LegalDashboard = () => {
  const [selectedPlan, setSelectedPlan] = useState('Free Plan');
  const {user,token,isAuthenticated}=useAuthStore()

  

  const handleDocumentPress = (docType:any) => {
    Alert.alert('Document Selected', `You selected: ${docType}`);
  };

  const handleServicePress = (service:any) => {
    Alert.alert('Service Selected', `You selected: ${service}`);
  };

  const DocumentCard = ({ title, subtitle, icon, onPress }:any) => (
    <TouchableOpacity style={styles.documentCard} onPress={onPress}>
      <View style={styles.documentIcon}>
        <Ionicons name={icon} size={24} color="#4A90E2" />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{title}</Text>
        <Text style={styles.documentSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  const ServiceCard = ({ title, description, icon, onPress }:any) => (
    <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
      <View style={styles.serviceIcon}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle}>{title}</Text>
        <Text style={styles.serviceDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        {/* Welcome Section */}
        <TabHeader title='Dashboard' onRight={<View style={styles.welcomeIcons}>
            <Ionicons name="share" size={20} color="#666" />
            <Ionicons name="bookmark" size={20} color="#666" />
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </View>}/>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Plan Section */}
        <View style={styles.planSection}>
          <Text style={styles.planBadge}>4 remaining docs</Text>
          <Text style={styles.planTitle}>Free Plan</Text>
          <Text style={styles.planSubtitle}>30 document generation per month</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Legal documents</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Email support</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Basic templates</Text>
            </View>
          </View>

          <View style={styles.upgradeNotice}>
            <Text style={styles.upgradeText}>
              Want more features for a limited time? Get access to advanced templates, priority support, and unlimited document generation.
            </Text>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={()=>router.push('/(screens)/subscriptions')}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem} >
              <Ionicons name="document-text" size={24} color="#4A90E2" />
              <Text style={styles.actionText}>New Case</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="people" size={24} color="#4A90E2" />
              <Text style={styles.actionText}>Client Manager</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="calendar" size={24} color="#4A90E2" />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="folder" size={24} color="#4A90E2" />
              <Text style={styles.actionText}>Document Storage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Case Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Management</Text>
          <TouchableOpacity style={styles.sectionButton}onPress={()=>router.push('/(screens)/dashboard')}>
            <Text style={styles.sectionButtonText}>View All Cases</Text>
          </TouchableOpacity>
        </View>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          <DocumentCard
            title="Software Partnership - Legal Tech Development"
            subtitle="Last Modified: Today, 2:30 PM"
            icon="document-text"
            onPress={() => handleDocumentPress('Software Partnership')}
          />
          <DocumentCard
            title="Client Agreement - Legal Tech Development"
            subtitle="Last Modified: Today, 2:30 PM"
            icon="document-text"
            onPress={() => handleDocumentPress('Client Agreement')}
          />
          <DocumentCard
            title="Contract Template - Legal Tech Development"
            subtitle="Last Modified: Today, 2:30 PM"
            icon="document-text"
            onPress={() => handleDocumentPress('Contract Template')}
          />
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <ServiceCard
            title="Settlement Disbursement"
            description="Expedite your settlement payment with our Settlement Disbursement feature"
            icon="card"
            onPress={() => handleServicePress('Settlement Disbursement')}
          />
          <ServiceCard
            title="Document Templates"
            description="Access professional legal document templates for various practice areas"
            icon="document-text"
            onPress={() => handleServicePress('Document Templates')}
          />
          <ServiceCard
            title="Demand Letter"
            description="Create professional demand letters with our guided template system"
            icon="mail"
            onPress={() => handleServicePress('Demand Letter')}
          />
          <ServiceCard
            title="Settlement Agreement"
            description="Generate comprehensive settlement agreements with customizable terms"
            icon="medical"
            onPress={() => handleServicePress('Settlement Agreement')}
          />
          <ServiceCard
            title="Medical Records Request"
            description="Streamline medical record requests with automated form generation"
            icon="medical"
            onPress={() => handleServicePress('Medical Records Request')}
          />
          <ServiceCard
            title="Client Intake Form"
            description="Digital client intake forms with automated data collection and storage"
            icon="person-add"
            onPress={() => handleServicePress('Client Intake Form')}
          />
          <ServiceCard
            title="Expert Witness Report"
            description="Professional expert witness report templates for litigation support"
            icon="person"
            onPress={() => handleServicePress('Expert Witness Report')}
          />
          <ServiceCard
            title="Court Filing Motion"
            description="Streamlined court filing motion templates for efficient case management"
            icon="hammer"
            onPress={() => handleServicePress('Court Filing Motion')}
          />
        </View>

        {/* Recent Clients */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Clients</Text>
          <View style={styles.recentItem}>
            <Ionicons name="person-circle" size={40} color="#4A90E2" />
            <View style={styles.recentContent}>
              <Text style={styles.recentName}>John Doe</Text>
              <Text style={styles.recentDate}>Last contact: 2 days ago</Text>
            </View>
          </View>
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Ionicons name="cloud-upload" size={48} color="#C7C7CC" />
          <Text style={styles.uploadText}>Upload a file or document</Text>
        </View>

        {/* Service Messages */}
        <View style={styles.messagesSection}>
          <Text style={styles.messagesTitle}>Service Messages</Text>
          
          <View style={styles.messageItem}>
            <View style={styles.messageHeader}>
              <Ionicons name="person-circle" size={24} color="#4A90E2" />
              <Text style={styles.messageSender}>Dr. Barbra</Text>
            </View>
            <Text style={styles.messageContent}>
              Lorem Ipsum Dolor Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>

          <View style={styles.messageItem}>
            <View style={styles.messageHeader}>
              <Ionicons name="person-circle" size={24} color="#4A90E2" />
              <Text style={styles.messageSender}>Inspector Garcia</Text>
            </View>
            <Text style={styles.messageContent}>
              Lorem Ipsum Dolor Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
          </View>
        </View>

        {/* Legal Assistant */}
        <View style={styles.assistantSection}>
          <Text style={styles.assistantTitle}>AI Legal Assistant</Text>
          <TouchableOpacity style={styles.assistantButton}>
            <Text style={styles.assistantButtonText}>Ask Legal Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default LegalDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  welcomeIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  planSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planBadge: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  upgradeNotice: {
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 12,
    color: '#F57C00',
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionItem: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  sectionButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sectionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  documentsSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  servicesSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recentSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  recentDate: {
    fontSize: 14,
    color: '#666',
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  messagesSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  messageItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  messageContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  assistantSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 62,
  },
  assistantTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  assistantButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  assistantButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});