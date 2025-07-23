import CompanyCard from "@/components/common/CompanyCard";
import PlanCard from "@/components/common/SubscriptionPlans";
import GenerateDocumentModal from "@/components/modals/GenerateDocumentModal";
import { colors } from "@/constants";
import { getRecentClients } from "@/services/api/billingService";
import { chatService } from "@/services/api/chatService";
import { useAuthStore } from "@/services/authStore";
import { useCaseStore } from "@/services/caseStore";
import { useChatStore } from "@/services/chatStore";
import { GeneratedDocument, useDocumentStore } from "@/services/documentStore";
import { handleOpenDocument } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const HEADER_MAX_HEIGHT = 310;
const HEADER_MIN_HEIGHT = 80;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const LegalDashboard = () => {
  const scrollRef = useRef<ScrollView>(null);
  const { user, token, currentPlan, fetchCurrentPlan, isAuthenticated } =
    useAuthStore();

  useEffect(() => {
    fetchCurrentPlan();
  }, []);
  const scrollY = useRef(new Animated.Value(0)).current;
  // ... other state and refs remain the same

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const heroOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.7],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const titleSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [28, 20],
    extrapolate: "clamp",
  });

  const titleMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [55, 35],
    extrapolate: "clamp",
  });

  const DocumentCard = ({ doc }: { doc: GeneratedDocument }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => handleOpenDocument(doc)}
    >
      <View style={styles.documentIcon}>
        <Ionicons name={"document-text"} size={24} color="#4A90E2" />
      </View>
      <View style={styles.documentContent}>
        <Text style={styles.documentTitle}>{doc.name}</Text>
        <Text style={styles.documentSubtitle}>{doc.description}</Text>
      </View>
      <TouchableOpacity
        style={styles.generatedDocButton}
        onPress={() => handleOpenDocument(doc)}
      >
        <Text style={styles.generatedDocButtonText}>Open</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.generatedDocButton, { backgroundColor: "#4A90E2" }]}
        onPress={() => handleOpenDocument(doc)}
      >
        <Text style={[styles.generatedDocButtonText, { color: "#fff" }]}>
          Download
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ServiceCard = ({ title, description, icon, onPress }: any) => (
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

  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageloading, setMessageLoading] = useState<string | null>(null);

  const { fetchThreads } = useChatStore();
  const { cases, selectedCase, fetchCases, fetchCaseById } = useCaseStore();
  const { documents, getDocuments } = useDocumentStore();
  const documentStore = useDocumentStore();

  useEffect(() => {
    setLoading(true);
    fetchCases();
    getRecentClients()
      .then((res) => setRecentClients(res.data))
      .catch((err) => {
        Toast.show({ type: "error", text1: "Failed to load companies" });
      })
      .finally(() => setLoading(false));
  }, []);

  const onMessagePress = async (id: string) => {
    setMessageLoading(id);
    try {
      const res = await chatService.createChatThread({
        scope: "company",
        clientCompanyId: id,
        lawCompanyId: user?.companyId,
      });
      console.log(res);
      await fetchThreads();
      router.push(`/chats/${res._id}`);
    } catch (err: any) {
      Toast.show({ type: "error", text1: err.message });
    } finally {
      setMessageLoading(null);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={["#1976D2", "#0D47A1"]}
          style={styles.headerGradient}
        >
          <Animated.Text
            style={[
              styles.heroTitle,
              {
                fontSize: titleSize,
                marginTop: titleMarginTop,
              },
            ]}
          >
            Welcome to FirmLink AI
          </Animated.Text>

          <Animated.View style={{ opacity: heroOpacity }}>
            <Text style={styles.heroSubtitle}>
              Empowering your law firm with AI-driven efficiency
            </Text>
            <View style={styles.heroMetricsRow}>
              <View style={styles.heroMetricCard}>
                <Ionicons name="briefcase" size={24} color="#fff" />
                <Text style={styles.heroMetricValue}>{cases.length}</Text>
                <Text style={styles.heroMetricLabel}>Total Cases</Text>
              </View>
              <View style={styles.heroMetricCard}>
                <Ionicons name="people" size={24} color="#fff" />
                <Text style={styles.heroMetricValue}>
                  {recentClients.length}
                </Text>
                <Text style={styles.heroMetricLabel}>Clients</Text>
              </View>
              <View style={styles.heroMetricCard}>
                <Ionicons name="document-text" size={24} color="#fff" />
                <Text style={styles.heroMetricValue}>{documents.length}</Text>
                <Text style={styles.heroMetricLabel}>Docs</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      >
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push("/cases")}
          >
            <Ionicons name="add-circle" size={28} color="#1976D2" />
            <Text style={styles.quickActionText}>New Case</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push("/clients")}
          >
            <Ionicons name="person-add" size={28} color="#1976D2" />
            <Text style={styles.quickActionText}>Add Client</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="document-text" size={28} color="#1976D2" />
            <Text style={styles.quickActionText}>Generate Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push("/(screens)/subscriptions")}
          >
            <Ionicons name="card" size={28} color="#1976D2" />
            <Text style={styles.quickActionText}>Manage Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Current Plan Card */}
        <View style={styles.planCardSection}>
          <PlanCard currentPlan={currentPlan} loading={loading} />
        </View>

        {/* Recent Documents */}
        {documents.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="documents" size={20} color="#4A5568" />
              <Text style={styles.sectionTitle}>Recent Documents</Text>
              <TouchableOpacity onPress={() => router.push("/documents")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {documents.slice(0, 3).map((doc, idx) => (
              <DocumentCard key={`doc-${idx}`} doc={doc} />
            ))}
          </View>
        )}

        {/* Recent Clients */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={20} color="#4A5568" />
            <Text style={styles.sectionTitle}>Recent Clients</Text>
            <TouchableOpacity onPress={() => router.push("/clients")}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentClients.map((item) => (
            <CompanyCard
              key={item._id}
              id={item.companyId}
              name={item.name}
              type="Client"
              onPress={onMessagePress}
              loadingId={messageloading}
            />
          ))}
        </View>

        {/* Julia Legal Assistant */}
        <TouchableOpacity
          onPress={() => router.push("/(screens)/julia")}
          style={styles.juliaCard}
        >
          <View style={styles.juliaHeader}>
            <View style={styles.juliaIcon}>
              <Ionicons name="sparkles" size={24} color="#6B46C1" />
            </View>
            <Text style={styles.juliaTitle}>Julia Legal Assistant</Text>
          </View>
          <Text style={styles.juliaText}>
            Your AI-powered legal assistant. Get instant help with research,
            drafting, and case analysis.
          </Text>
          <TouchableOpacity
            style={styles.juliaButton}
            onPress={() => router.push("/(screens)/julia")}
          >
            <Text style={styles.juliaButtonText}>Start Conversation</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <GenerateDocumentModal
          visible={modalVisible}
          onClose={handleModalClose}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default LegalDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#EBF8FF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  heroMetricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroMetricCard: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 16,
    width: Dimensions.get("window").width / 3.5,
  },
  heroMetricValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  heroMetricLabel: {
    color: "#EBF8FF",
    fontSize: 12,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginLeft: 8,
    flex: 1,
  },
  viewAllText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },
  documentIcon: {
    backgroundColor: "#EBF8FF",
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
  },
  documentSubtitle: {
    fontSize: 12,
    color: "#718096",
    marginTop: 4,
  },
  generatedDocButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  generatedDocButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    margin: 16,
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    width: Dimensions.get("window").width / 2 - 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  quickActionText: {
    color: "#2D3748",
    fontWeight: "500",
    fontSize: 14,
    marginTop: 8,
  },
  clientList: {
    paddingVertical: 8,
    width: Dimensions.get("window").width - 32,
  },
  juliaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  juliaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  juliaIcon: {
    backgroundColor: "#FAF5FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  juliaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  juliaText: {
    fontSize: 15,
    color: "#4A5568",
    lineHeight: 22,
    marginBottom: 16,
  },
  juliaButton: {
    backgroundColor: "#6B46C1",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  juliaButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  welcomeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  welcomeIcons: {
    flexDirection: "row",
    gap: 16,
  },
  planSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planBadge: {
    backgroundColor: "#E3F2FD",
    color: "#1976D2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  planSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  planFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#333",
  },
  upgradeNotice: {
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  upgradeText: {
    fontSize: 12,
    color: "#F57C00",
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  actionItem: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  sectionButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  sectionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  documentsSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  recentSection: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  recentDate: {
    fontSize: 14,
    color: "#666",
  },
  uploadSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  uploadText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  messagesSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  messageItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  messageContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  assistantMessage: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  assistantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  assistantAvatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  assistantContent: {
    flex: 1,
  },
  assistantText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  assistantActions: {
    flexDirection: "row",
    gap: 8,
  },
  assistantButton: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  assistantButtonText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
  assistantNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  assistantNoteText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },
  generatedDocsSection: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
  },
  generatedDocsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginLeft: 16,
  },
  generatedDocCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  generatedDocName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  generatedDocMeta: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  heroSection: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 12,
  },
  planCardSection: {
    marginBottom: 18,
  },
});
