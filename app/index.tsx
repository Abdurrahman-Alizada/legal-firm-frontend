import { fonts } from "@/constants";
import { useAuthStore } from "@/services/authStore";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

const LegalPracticeScreen = () => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loadFromStorage } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    loadFromStorage().then((res) => {
      if (res) {
        if (res === "admin") {
          router.replace("/(admin)");
        } else if (res === "client") {
          router.replace("/(client)");
        }else if(res ==="employee"){
          router.replace("/(admin)");
        }

      }
      setLoading(false);
    });
  }, []);

  const handleStartFreeTrial = () => {
    router.push("/(auth)");
  };

  const handleAdminDemo = () => {
    router.push("/(admin)");
  };

  const handleClientDemo = () => {
    router.push("/(client)");
  };

  return loading ? (
    <View style={styles.centerContainer}>
      <Image
        style={styles.logoimg}
        source={require("@/assets/images/icon.jpg")}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content */}
        <LinearGradient
          colors={["#e3f2fd", "#bbdefb", "#90caf9"]}
          style={styles.mainContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>
              Revolutionize your legal practice
            </Text>

            <Text style={styles.subtitle}>
              with AI-powered case management, secure client communications, and
              intelligent research assistance.
            </Text>

            <Text style={styles.description}>
              Experience the future of legal technology with comprehensive case
              management, AI-powered document analysis, and secure client
              communications.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleStartFreeTrial}
              activeOpacity={0.8}
            >
              <Octicons
                name="law"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>Start Free</Text>
            </TouchableOpacity>
{/* 
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleAdminDemo}
              activeOpacity={0.8}
            >
              <Ionicons
                name="settings"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.secondaryButtonText}>Admin Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleClientDemo}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.secondaryButtonText}>Client Demo</Text>
            </TouchableOpacity> */}
          </View>

          {/* Feature Cards */}
          <View style={styles.featuresSection}>
            {/* AI-Powered Research Card */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="construct" size={24} color="#1976d2" />
              </View>
              <Text style={styles.featureTitle}>AI-Powered Research</Text>
              <Text style={styles.featureDescription}>
                Get instant legal insights, case law suggestions, and statutory
                analysis with JuliaMD AI.
              </Text>
            </View>

            {/* Secure Communications Card */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#1976d2" />
              </View>
              <Text style={styles.featureTitle}>Secure Communications</Text>
              <Text style={styles.featureDescription}>
                End-to-end encrypted messaging and file sharing that meets legal
                industry standards.
              </Text>
            </View>

            {/* Smart Analytics Card */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="bar-chart" size={24} color="#1976d2" />
              </View>
              <Text style={styles.featureTitle}>Smart Analytics</Text>
              <Text style={styles.featureDescription}>
                Real-time insights into case progress, billing, and firm
                performance metrics.
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoimg: {
    width: 200,
    height: 200,
    borderRadius:30
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f8f9fa",
  },
  logo: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroSection: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: width > 400 ? 34 : 28,
    fontFamily: fonts.family.bold,
    color: "#1976d2",
    lineHeight: width > 400 ? 40 : 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "400",
    color: "#333",
    lineHeight: width > 400 ? 26 : 24,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    opacity: 0.8,
  },
  buttonSection: {
    marginBottom: 40,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  primaryButton: {
    backgroundColor: "#1976d2",
  },
  secondaryButton: {
    backgroundColor: "#1976d2",
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresSection: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    textAlign: "center",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
});

export default LegalPracticeScreen;
