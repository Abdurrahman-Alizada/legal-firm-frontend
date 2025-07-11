import Button from "@/components/ui/Button";
import DropdownInput from "@/components/ui/Dropdown";
import { ScreenHeader } from "@/components/ui/Headers";
import { colors, fonts, layout, spacing } from "@/constants";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/services/authStore";
import { adminRole, clientRole } from "@/types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FirmLinkAuthScreen() {
  const { register, login, isLoading, error } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleId:""
  });

  // State for auth mode
  const [authMode, setAuthMode] = useState<"signup" | "login" | "reset">(
    "signup"
  );
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");

  const handleInputChange = (field: any, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = (step: any) => {
    if (step === 1) return formData.name && formData.email && formData.phone;
    return false;
  };

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert("Please fill in all fields");
      return;
    }
    register({ ...formData });
  };
  const handleSendResetLink = async () => {
    if (!resetEmail) {
      Alert.alert("Please enter an email");
      return;
    }
    setLoading(true);
    await authService
      .forgotPassword({ email: resetEmail })
      .then((res) => {
        Alert.alert("Success", res.message || "Reset link sent to your email.");
      })
      .catch((error) => {
        Alert.alert(
          "Error",
          error.message == "AxiosError: Request failed with status code 404"
            ? "No user with that email not found"
            : error.message || "Failed to send reset link."
        );
      })
      .finally(() => {
        setResetEmail("");
        setLoading(false);
      });
  };

  // --- Auth Forms ---
  const renderSignupForm = () => (
    <>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Create Your Account</Text>
        <Text style={styles.formSubtitle}>
          Get started with your free trial today
        </Text>
        {error && (
          <Text style={{ color: "red", marginBottom: spacing.sm }}>
            {error}
          </Text>
        )}
        {renderStepContent()}
      </View>
      <Button
        title="Sign up"
        onPress={handleSignUp}
        loading={isLoading}
        variant="primary"
        style={styles.mainButton}
      />
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.previousButton, currentStep === 1 && styles.buttonDisabled]}
          onPress={handlePreviousStep}
          disabled={currentStep === 1}
        >
          <Text style={[styles.buttonText, styles.previousButtonText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            (currentStep === 1 && !isStepComplete(1)) && styles.buttonDisabled
          ]}
          onPress={handleNextStep}
          disabled={currentStep === 1 && !isStepComplete(1)}
        >
          <Text style={[styles.buttonText, styles.nextButtonText]}>
            {currentStep === 3 ? 'Get Started' : 'Next Step'}
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => setAuthMode("login")}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderLoginForm = () => (
    <>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Sign In</Text>
        <Text style={styles.formSubtitle}>Welcome back! Please log in.</Text>
        <View style={styles.formContainer}>
          {error && (
            <Text style={{ color: "red", marginBottom: spacing.sm }}>
              {error}
            </Text>
          )}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={loginData.email}
              onChangeText={(text) =>
                setLoginData({ ...loginData, email: text })
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              value={loginData.password}
              autoCapitalize="none"
              onChangeText={(text) =>
                setLoginData({ ...loginData, password: text })
              }
              secureTextEntry
            />
          </View>
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginTop: spacing.xs }}
            onPress={() => setAuthMode("reset")}
          >
            <Text style={styles.forgotLink}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button
        title="Login"
        onPress={() => login(loginData)}
        loading={isLoading}
        variant="primary"
        style={styles.mainButton}
      />
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => setAuthMode("signup")}>
          <Text style={styles.signInLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderResetForm = () => (
    <>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Reset Password</Text>
        <Text style={styles.formSubtitle}>
          Enter your email to receive reset instructions.
        </Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>
      </View>
      <Button
        title="Send Reset Link"
        onPress={handleSendResetLink}
        loading={loading}
        variant="primary"
        style={styles.mainButton}
      />
      <View style={styles.signInContainer}>
        <TouchableOpacity onPress={() => setAuthMode("login")}>
          <Text style={styles.signInLink}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // --- Stepper Content ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.formContainer}>
            <DropdownInput
            label="Role"
              data={[{label:adminRole.name,value:adminRole._id},{label:clientRole.name,value:clientRole._id}]}
              onSelect={(text)=>handleInputChange("roleId",text.value)}
              value={formData.roleId}
              containerStyle={{margin:0}}
            />
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.textInput}
                secureTextEntry
                placeholder="Password"
                autoCapitalize="none"
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
              />
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContentContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={32}
                color={colors.primaryDark}
              />
            </View>
            <Text style={styles.stepTitle}>Verify Your Identity</Text>
            <Text style={styles.stepDescription}>
              We'll send a verification code to your email and phone number to
              confirm your identity.
            </Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContentContainer}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.success + "22" },
              ]}
            >
              <FontAwesome6 name="brain" size={32} color={colors.success} />
            </View>
            <Text style={styles.stepTitle}>Setup Complete</Text>
            <Text style={styles.stepDescription}>
              Your FirmLink AI account is ready! You can now access all features
              and start using our AI-powered legal assistant.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Join FirmLink AI" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* {authMode === "signup" && (
          <>
            <View style={styles.stepsContainer}>
              {[1, 2, 3].map((step) => (
                <View key={step} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepCircle,
                      step === currentStep
                        ? styles.stepActive
                        : step < currentStep
                        ? styles.stepComplete
                        : styles.stepInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumber,
                        step === currentStep
                          ? styles.stepNumberActive
                          : step < currentStep
                          ? styles.stepNumberComplete
                          : styles.stepNumberInactive,
                      ]}
                    >
                      {step}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text style={styles.stepIndicator}>
              Step {currentStep} of 3:{" "}
              {currentStep === 1
                ? "Personal Information"
                : currentStep === 2
                ? "Verification"
                : "Setup Complete"}
            </Text>
          </>
        )} */}

        {authMode === "signup" && renderSignupForm()}
        {authMode === "login" && renderLoginForm()}
        {authMode === "reset" && renderResetForm()}

        {/* Why Choose FirmLink AI */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Why Choose FirmLink AI?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.primaryLight + "22" },
                ]}
              >
                <FontAwesome6
                  name="brain"
                  size={20}
                  color={colors.primaryDark}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>
                  AI-Powered Legal Assistant
                </Text>
                <Text style={styles.featureDescription}>
                  Julia AI handles research, document analysis, and case
                  insights automatically.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.success + "22" },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={colors.success}
                />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>
                  HIPAA-Compliant Security
                </Text>
                <Text style={styles.featureDescription}>
                  End-to-end encryption, role-based access, and audit trails for
                  healthcare data protection.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.accent + "22" },
                ]}
              >
                <Ionicons name="calculator" size={20} color={colors.accent} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Settlement Management</Text>
                <Text style={styles.featureDescription}>
                  Automated disbursement calculations and payment processing.
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.trialBanner}>
            <Text style={styles.trialTitle}>14-Day Free Trial</Text>
            <Text style={styles.trialSubtitle}>No credit card required</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles using constants ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollView: {
    flex: 1,
    paddingTop: spacing.md,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.md,
    gap: spacing.xl,
  },
  stepItem: {
    alignItems: "center",
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: colors.primaryLight,
  },
  stepComplete: {
    backgroundColor: colors.success,
  },
  stepInactive: {
    backgroundColor: colors.border.medium,
  },
  stepNumber: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
  },
  stepNumberActive: {
    color: colors.text.white,
  },
  stepNumberComplete: {
    color: colors.text.white,
  },
  stepNumberInactive: {
    color: colors.text.secondary,
  },
  stepIndicator: {
    textAlign: "center",
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  featuresCard: {
    backgroundColor: colors.background.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.md,
  },
  featuresTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  featuresList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  trialBanner: {
    backgroundColor: colors.primaryLight + "11",
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
    marginTop: spacing.lg,
  },
  trialTitle: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.semibold,
    color: colors.primaryDark,
    marginBottom: 2,
  },
  trialSubtitle: {
    fontSize: fonts.sizes.xs,
    color: colors.primaryLight,
  },
  formCard: {
    marginTop: spacing.md,
    backgroundColor: colors.background.primary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.md,
  },
  formTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  formContainer: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    fontSize: fonts.sizes.sm,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: layout.borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  stepContentContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
    paddingVertical: spacing.xl + spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  stepTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  mainButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },

  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  previousButton: {
    backgroundColor: colors.background.secondary,
  },
  nextButton: {
    backgroundColor: colors.primaryLight,
  },
  buttonDisabled: {
    backgroundColor: colors.border.medium,
  },
  buttonText: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
  },
  previousButtonText: {
    color: colors.text.primary,
  },
  nextButtonText: {
    color: colors.text.white,
  },
  signInContainer: {
    alignSelf: "center",
    marginBottom: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
  },
  signInText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  signInLink: {
    color: colors.primaryLight,
    fontWeight: fonts.weights.semibold,
    fontSize: fonts.sizes.sm,
  },
  forgotLink: {
    color: colors.primaryLight,
    fontWeight: fonts.weights.medium,
    fontSize: fonts.sizes.sm,
    textDecorationLine: "underline",
  },
});
