import Spinner from "@/components/common/Spinner";
import { ScreenHeader } from "@/components/ui/Headers";
import { initiateCheckout } from "@/services/api/billingService";
import { useAuthStore } from "@/services/authStore";
import { Ionicons } from "@expo/vector-icons";
import {
  CardField,
  useConfirmPayment
} from "@stripe/stripe-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const pricingPlans = [
  {
    title: "Free Plan",
    subtitle: "Perfect for solo practitioners getting started",
    price: "$0",
    period: "per month",
    buttonText: "Start Free",
    buttonColor: "#e0e0e0",
    textColor: "#666",
    onPressKey: "free",
    features: [
      "5 Cases per month",
      "Basic case management",
      "Email support",
      "Document storage (1GB)",
      "Basic templates",
    ],
  },
  {
    priceId: "price_1RiHAaKwNCwsnrlDiG1iA3rM",
    title: "Solo Plan",
    subtitle: "For individual attorneys, limited legal practice",
    price: "$19.99",
    period: "per month",
    buttonText: "Upgrade to pro",
    buttonColor: "#ff5722",
    isPopular: true,
    onPressKey: "pro",
    features: [
      "50 Cases per month",
      "Advanced case management",
      "Priority email support",
      "Document storage (25GB)",
      "Premium templates",
      "Unlimited AI assistant",
      "Custom branding",
      "Advanced reporting",
    ],
  },
  {
    priceId: "price_1RiHAbKwNCwsnrlD9WTDIJ4e",
    title: "Small Firm",
    subtitle: "For small firms with 2-10 attorneys",
    price: "$299",
    period: "per month",
    buttonText: "Upgrade to plus",
    buttonColor: "#2196f3",
    onPressKey: "plus",
    features: [
      "Unlimited cases",
      "Multi-user access (up to 10)",
      "Phone & email support",
      "Document storage (100GB)",
      "Team collaboration tools",
      "Advanced client portal",
      "Custom integrations",
      "Firm-wide analytics",
      "Settlement management",
      "Multi-language support",
    ],
  },
  {
    priceId: "price_1RiHAcKwNCwsnrlD96JUT2nO",
    title: "Growth Firm",
    subtitle: "For growing firms with 10+ attorneys",
    price: "$699",
    period: "per month",
    buttonText: "Contact Sales",
    buttonColor: "#2196f3",
    onPressKey: "sales",
    features: [
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
      "Enterprise SSO",
    ],
  },
];

type pricingCardProps = {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  buttonText: string;
  buttonColor: string;
  onPress: () => void;
  isSubscribed:boolean;
  features: string[];
  isPopular?: boolean;
  textColor?: string;
};

const PricingScreen = () => {
  const [expandedNotes, setExpandedNotes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const {currentPlan}=useAuthStore()

  const FeatureItem = ({
    text,
    included = true,
  }: {
    text: string;
    included?: boolean;
  }) => (
    <View style={styles.featureItem}>
      <Ionicons
        name={included ? "checkmark" : "close"}
        size={16}
        color={included ? "#4caf50" : "#f44336"}
        style={styles.featureIcon}
      />
      <Text
        style={[styles.featureText, !included && styles.featureTextDisabled]}
      >
        {text}
      </Text>
    </View>
  );

  const PricingCard = ({
    title,
    subtitle,
    price,
    period,
    isSubscribed,
    buttonText,
    buttonColor,
    onPress,
    features,
    isPopular = false,
    textColor = "#333",
  }: pricingCardProps) => (
    <View key={title} style={[styles.pricingCard, isPopular && styles.popularCard]}>
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
        disabled={loading || isSubscribed}
      >
          <Text style={styles.planButtonText}>{isSubscribed?"Currently Subscribed":buttonText}</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature} />
        ))}
      </View>
    </View>
  );

  const handleUpgrade = async (priceId: string | undefined, plan: any) => {
    if (!priceId) {
      Alert.alert("Error", "Invalid plan selected");
      return;
    }

    setLoading(true);
    setSelectedPlan(plan);
    
    try {
      const { data } = await initiateCheckout(priceId);
      
      if (data && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentLoading(true)
      } else {
        Alert.alert("Error", "Failed to initialize payment");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert("Error", "Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  const PaymentModal = () => {
    const { confirmPayment } = useConfirmPayment();
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const handlePayment = async () => {
      if (!clientSecret || !cardDetails?.complete) {
        Alert.alert("Error", "Please enter valid card details");
        return;
      }

      setProcessingPayment(true);

      try {
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          paymentMethodData: {
            billingDetails: {
              email: "customer@example.com", // You might want to get this from user profile
            },
          },
        });

        if (error) {
          Alert.alert("Payment Failed", error.message);
        } else if (paymentIntent) {
          Alert.alert(
            "Payment Successful!",
            `You have successfully subscribed to ${selectedPlan?.title}`,
            [
              {
                text: "OK",
                onPress: () => {
                  setPaymentLoading(false);
                  setClientSecret(null);
                  setSelectedPlan(null);
                }
              }
            ]
          );
        }
      } catch (error) {
        console.error('Payment error:', error);
        Alert.alert("Error", "Payment processing failed");
      } finally {
        setProcessingPayment(false);
      }
    };

    return (
      <View style={styles.paymentModal}>
        <View style={styles.paymentContent}>
          <Text style={styles.paymentTitle}>Complete Payment</Text>
          <Text style={styles.paymentSubtitle}>
            {selectedPlan?.title} - {selectedPlan?.price}{selectedPlan?.period}
          </Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: "4242 4242 4242 4242",
            }}
            autofocus={true}
            cardStyle={styles.cardField}
            style={styles.cardFieldContainer}
            onCardChange={(cardDetails) => {setCardDetails(cardDetails);}}
          />
          
          <TouchableOpacity
            style={[
              styles.payButton,
              (!cardDetails?.complete || processingPayment) && styles.payButtonDisabled
            ]}
            onPress={handlePayment}
            disabled={!cardDetails?.complete || processingPayment}
          >
            {processingPayment ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.payButtonText}>Processing...</Text>
              </View>
            ) : (
              <Text style={styles.payButtonText}>
                Pay {selectedPlan?.price}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setPaymentLoading(false);
              setClientSecret(null);
              setSelectedPlan(null);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
      <View style={styles.container}>
       <ScreenHeader title="pricing"/>

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
            {pricingPlans.map((plan, index) => (
              <PricingCard
                key={index}
                title={plan.title}
                subtitle={plan.subtitle}
                price={plan.price}
                period={plan.period}
                isSubscribed={currentPlan?.stripePlanId==plan.priceId}
                buttonText={plan.buttonText}
                buttonColor={plan.buttonColor}
                textColor={plan.textColor}
                isPopular={plan.isPopular}
                features={plan.features}
                onPress={() => handleUpgrade(plan.priceId, plan)}
              />
            ))}
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
                  • Free: Basic features, limited integrations{"\n"}• Solo:
                  Enhanced features, single user{"\n"}• Small Team: Team features,
                  multi-user access{"\n"}• Growth: Enterprise features, unlimited
                  users
                </Text>

                <Text style={styles.notesSubtitle}>Testing:</Text>
                <Text style={styles.notesText}>
                  • Any plan to "activate" it instantly{"\n"}• Dashboard will
                  adapt based on select tier{"\n"}• Test billing by selecting
                  different tier
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
            <Spinner visible={loading}/>
        {/* Payment Modal */}
        {paymentLoading && clientSecret && (
          <PaymentModal />
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e3f2fd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 6,
  },
  promoText: {
    fontSize: 12,
    color: "#1976d2",
    marginLeft: 6,
    fontWeight: "500",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1976d2",
    textAlign: "center",
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  pricingSection: {
    paddingHorizontal: 16,
    gap: 16,
  },
  pricingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    position: "relative",
  },
  popularCard: {
    borderColor: "#ff5722",
    borderWidth: 2,
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "#ff5722",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
  },
  period: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  planButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  planButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 13,
    color: "#333",
    flex: 1,
  },
  featureTextDisabled: {
    color: "#999",
  },
  notesSection: {
    margin: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  notesContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  notesSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 8,
  },
  notesText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  paymentModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  cardFieldContainer: {
    marginBottom: 16,
    height: 50,
    borderRadius: 6,
  },
  cardField: {
    borderRadius: 6,
    padding: 12,
    height: 50,
    fontSize: 16,
    //@ts-ignore
    // textColor:"#000"
  },
  payButton: {
    padding: 12,
    borderRadius: 6,
    marginBottom:10,
    backgroundColor: "#2196f3",
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#f44336",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default PricingScreen;
