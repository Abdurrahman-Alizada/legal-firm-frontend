import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type pricingCardProps={
    title: string;
    subtitle: string;
    price: string;
    period: string;
    buttonText: string;
    buttonColor: string;
    onPress: () => void;
    features: string[];
    isPopular?: boolean;
    textColor?: string;
}

const PricingScreen = () => {
  const [expandedNotes, setExpandedNotes] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleStartFree = () => {
    console.log('Start Free pressed');
  };

  const handleUpgradeToPro = () => {
    console.log('Upgrade to Pro pressed');
  };

  const handleUpgradeToPlus = () => {
    console.log('Upgrade to Plus pressed');
  };

  const handleContactSales = () => {
    console.log('Contact Sales pressed');
  };

  const FeatureItem = ({ text, included = true }:{text:string, included?:boolean}) => (
    <View style={styles.featureItem}>
      <Ionicons 
        name={included ? "checkmark" : "close"} 
        size={16} 
        color={included ? "#4caf50" : "#f44336"} 
        style={styles.featureIcon} 
      />
      <Text style={[styles.featureText, !included && styles.featureTextDisabled]}>
        {text}
      </Text>
    </View>
  );

  const PricingCard = ({ 
    title, 
    subtitle, 
    price, 
    period, 
    buttonText, 
    buttonColor, 
    onPress, 
    features, 
    isPopular = false,
    textColor = '#333'
  }:pricingCardProps) => (
    <View style={[styles.pricingCard, isPopular && styles.popularCard]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
        </View>
      )}
      
      <Text style={[styles.planTitle, { color: textColor }]}>{title}</Text>
      <Text style={styles.planSubtitle}>{subtitle}</Text>
      
      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: textColor }]}>{price}</Text>
        <Text style={styles.period}>{period}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.planButton, { backgroundColor: buttonColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.planButtonText}>{buttonText}</Text>
      </TouchableOpacity>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature} />
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Promotion Banner */}
        <View style={styles.promoBanner}>
          <Ionicons name="shield-checkmark" size={16} color="#1976d2" />
          <Text style={styles.promoText}>
            PROTECT YOUR MODE - All plans available for testing
          </Text>
        </View>

        {/* Main Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Choose Your FirmLink AI Plan</Text>
          <Text style={styles.mainSubtitle}>
            Select the perfect plan for your legal practice
          </Text>
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingSection}>
          {/* Free Plan */}
          <PricingCard
            title="Free Plan"
            subtitle="Perfect for solo practitioners getting started"
            price="$0"
            period="per month"
            buttonText="Start Free"
            buttonColor="#e0e0e0"
            textColor="#666"
            onPress={handleStartFree}
            features={[
              "5 Cases per month",
              "Basic case management",
              "Email support",
              "Document storage (1GB)",
              "Basic templates"
            ]}
          />

          {/* Solo Plan */}
          <PricingCard
            title="Solo Plan"
            subtitle="For individual attorneys, limited legal practice"
            price="$19.99"
            period="per month"
            buttonText="Upgrade to pro"
            buttonColor="#ff5722"
            onPress={handleUpgradeToPro}
            isPopular={true}
            features={[
              "50 Cases per month",
              "Advanced case management",
              "Priority email support",
              "Document storage (25GB)",
              "Premium templates",
              "Unlimited AI assistant",
              "Custom branding",
              "Advanced reporting"
            ]}
          />

          {/* Small Firm */}
          <PricingCard
            title="Small Firm"
            subtitle="For small firms with 2-10 attorneys"
            price="$299"
            period="per month"
            buttonText="Upgrade to plus"
            buttonColor="#2196f3"
            onPress={handleUpgradeToPlus}
            features={[
              "Unlimited cases",
              "Multi-user access (up to 10)",
              "Phone & email support",
              "Document storage (100GB)",
              "Team collaboration tools",
              "Advanced client portal",
              "Custom integrations",
              "Firm-wide analytics",
              "Settlement management",
              "Multi-language support"
            ]}
          />

          {/* Growth Firm */}
          <PricingCard
            title="Growth Firm"
            subtitle="For growing firms with 10+ attorneys"
            price="$699"
            period="per month"
            buttonText="Contact Sales"
            buttonColor="#2196f3"
            onPress={handleContactSales}
            features={[
              "Everything in Small Firm",
              "Unlimited users",
              "24/7 phone support",
              "Document storage (500GB)",
              "White-label solution",
              "Premium API access",
              "Custom development",
              "Dedicated account manager",
              "Advanced security features",
              "HIPAA compliance tools",
              "Enterprise SSO"
            ]}
          />
        </View>

        {/* Developer Testing Notes */}
        <View style={styles.notesSection}>
          <TouchableOpacity 
            style={styles.notesHeader}
            onPress={() => setExpandedNotes(!expandedNotes)}
          >
            <Text style={styles.notesTitle}>🔧 Developer Testing Notes</Text>
            <Ionicons 
              name={expandedNotes ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          
          {expandedNotes && (
            <View style={styles.notesContent}>
              <Text style={styles.notesSubtitle}>Tier Features:</Text>
              <Text style={styles.notesText}>
                • Free: Basic features, limited integrations{'\n'}
                • Solo: Enhanced features, single user{'\n'}
                • Small Team: Team features, multi-user access{'\n'}
                • Growth: Enterprise features, unlimited users
              </Text>
              
              <Text style={styles.notesSubtitle}>Testing:</Text>
              <Text style={styles.notesText}>
                • Any plan to "activate" it instantly{'\n'}
                • Dashboard will adapt based on select tier{'\n'}
                • Test billing by selecting different tier
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 6,
  },
  promoText: {
    fontSize: 12,
    color: '#1976d2',
    marginLeft: 6,
    fontWeight: '500',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  pricingSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  pricingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
  },
  popularCard: {
    borderColor: '#ff5722',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#ff5722',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
  },
  period: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  planButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  planButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  featureTextDisabled: {
    color: '#999',
  },
  notesSection: {
    margin: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notesContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notesSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});

export default PricingScreen;