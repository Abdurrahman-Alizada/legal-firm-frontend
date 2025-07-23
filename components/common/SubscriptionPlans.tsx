import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlanSkeleton } from "../ui/Skeletons";

export const pricingPlans = [
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

const PlanCard = ({ currentPlan, loading }: any) => {
  const isFree = !currentPlan;
  const [expanded, setExpanded] = useState(false);

  // currentPlan is from your store (e.g., useAuthStore)
  const plan = pricingPlans.find(
    (p) => p.priceId && p.priceId === currentPlan?.stripePlanId
  );

  // Fallback to Free Plan if not found
  const features = plan?.features || [
    "Legal documents",
    "Email support",
    "Basic templates",
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {loading ? (
          <PlanSkeleton />
        ) : isFree ? (
          <>
            <Text style={styles.badge}>4 remaining docs</Text>
            <Text style={styles.title}>Free Plan</Text>
            <Text style={styles.subtitle}>
              30 document generations per month
            </Text>

            <View style={styles.features}>
              {["Legal documents", "Email support", "Basic templates"].map(
                (item, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{item}</Text>
                  </View>
                )
              )}
            </View>

            <Text style={styles.notice}>
              Want more features? Upgrade for advanced templates, priority
              support & unlimited documents.
            </Text>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push("/(screens)/subscriptions")}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            
            <Text style={styles.title}>{currentPlan?.stripeProduct?.name}</Text>
            <Text style={styles.subtitle}>
              {"Active subscription"}
            </Text>
<Text style={styles.badge}>
              Subscribed: {currentPlan?.stripeProduct?.name}
            </Text>
            {expanded && (
              <View style={styles.features}>
                {features.map((item, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark" size={16} color="#4CAF50" />
                    <Text style={styles.featureText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => router.push("/(screens)/subscriptions")}
            >
              <Text style={styles.manageButtonText}>Manage Plan</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

type pricingCardProps = {
  title: string;
  subtitle: string;
  price: string;
  period: string;
  buttonText: string;
  buttonColor: string;
  onPress: () => void;
  isSubscribed: boolean;
  features: string[];
  isPopular?: boolean;
  textColor?: string;
};

// New reusable subscription plan card
export const SubscriptionPlanCard = ({
  title,
  subtitle,
  price,
  period,
  buttonText,
  buttonColor,
  onPress,
  features,
  isPopular = false,
  textColor = "#333",
  isCurrentPlan = false,
  loading = false,
}: {
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
  isCurrentPlan?: boolean;
  loading?: boolean;
}) => (
  <View
    style={[
      styles.pricingCard,
      isPopular && styles.popularCard,
      isCurrentPlan && {
        borderColor: "#1976D2",
        borderWidth: 2,
        backgroundColor: "#F0F7FF",
      },
    ]}
  >
    {isPopular && (
      <View style={styles.popularBadge}>
        <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
      </View>
    )}
    {isCurrentPlan && (
      <View
        style={[
          styles.popularBadge,
          { backgroundColor: "#1976D2", top: -10, left: 120 },
        ]}
      >
        <Text style={[styles.popularBadgeText, { color: "#fff" }]}>
          CURRENT PLAN
        </Text>
      </View>
    )}
    <Text style={[styles.planTitle, { color: textColor }]}>{title}</Text>
    <Text style={styles.planSubtitle}>{subtitle}</Text>
    <View style={styles.priceContainer}>
      <Text style={[styles.price, { color: textColor }]}>{price}</Text>
      <Text style={styles.period}>{period}</Text>
    </View>
    <TouchableOpacity
      style={[
        styles.planButton,
        { backgroundColor: isCurrentPlan ? "#e0e0e0" : buttonColor },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading || isCurrentPlan}
    >
      <Text style={styles.planButtonText}>
        {isCurrentPlan ? "Currently Subscribed" : buttonText}
      </Text>
    </TouchableOpacity>
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => (
        <View key={index} style={styles.featureItem}>
          <Ionicons
            name="checkmark"
            size={16}
            color="#4caf50"
            style={styles.featureIcon}
          />
          <Text style={styles.featureText}>{feature}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  badge: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#222",
    textTransform: "capitalize",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  features: { marginBottom: 16 },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: { marginLeft: 8, fontSize: 14, color: "#333" },
  notice: {
    fontSize: 13,
    color: "#777",
    marginBottom: 16,
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  manageButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  manageButtonText: {
    color: "#1976D2",
    fontWeight: "600",
    fontSize: 15,
  },

  pricingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  popularCard: {
    borderColor: "#1976D2",
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: "#1976D2",
    borderRadius: 12,
    padding: 4,
    position: "absolute",
    top: -10,
    left: 120,
  },
  popularBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  planSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  period: {
    fontSize: 14,
    color: "#777",
    marginLeft: 8,
  },
  planButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  planButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  featuresContainer: { marginBottom: 16 },
  featureIcon: { marginRight: 8 },
});

export default PlanCard;
