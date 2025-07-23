import Button from "@/components/ui/Button";
import DropdownInput from "@/components/ui/Dropdown";
import { ScreenHeader } from "@/components/ui/Headers";
import CustomInput from "@/components/ui/Input";
import { colors, fonts, layout, spacing } from "@/constants";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/services/authStore";
import { adminRole, clientRole } from "@/types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
    roleId: "",
  });
  // Error state for signup
  const [signupErrors, setSignupErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    roleId: "",
  });
  // Debounce refs for signup
  const signupDebounceRefs = useRef({
    name: null as any,
    email: null as any,
    password: null as any,
    phone: null as any,
    roleId: null as any,
  });

  // State for auth mode
  const [authMode, setAuthMode] = useState<"signup" | "login" | "reset">(
    "signup"
  );
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({ email: "", password: "" });
  const loginDebounceRefs = useRef({ email: null as any, password: null as any });

  const [resetEmail, setResetEmail] = useState("");
  const [resetErrors, setResetErrors] = useState({ email: "" });
  const resetDebounceRef = useRef<any>(null);
  const [obsecurePass, setObsecurePass] = useState(false);

  // --- Validation Functions ---
  const validateEmail = (email: string) => {
    if (!email) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) ? "" : "Invalid email format";
  };
  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };
  const validateName = (name: string) => {
    if (!name) return "Name is required";
    return "";
  };
  const validatePhone = (phone: string) => {
    if (!phone) return "Phone is required";
    // Simple phone validation (10-15 digits)
    const re = /^\d{10,15}$/;
    return re.test(phone) ? "" : "Invalid phone number";
  };
  const validateRoleId = (roleId: string) => {
    if (!roleId) return "Role is required";
    return "";
  };

  // --- Debounced Validation Handlers ---
  const handleSignupInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (signupDebounceRefs.current[field]) {
      clearTimeout(signupDebounceRefs.current[field]);
    }
    signupDebounceRefs.current[field] = setTimeout(() => {
      let error = "";
      switch (field) {
        case "name":
          error = validateName(value);
          break;
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
        case "phone":
          error = validatePhone(value);
          break;
        case "roleId":
          error = validateRoleId(value);
          break;
      }
      setSignupErrors((prev) => ({ ...prev, [field]: error }));
    }, 500);
  };

  const handleLoginInputChange = (field: keyof typeof loginData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (loginDebounceRefs.current[field]) {
      clearTimeout(loginDebounceRefs.current[field]);
    }
    loginDebounceRefs.current[field] = setTimeout(() => {
      let error = "";
      if (field === "email") error = validateEmail(value);
      if (field === "password") error = value ? "" : "Password is required";
      setLoginErrors((prev) => ({ ...prev, [field]: error }));
    }, 500);
  };

  const handleResetInputChange = (text: string) => {
    setResetEmail(text);
    if (resetDebounceRef.current) clearTimeout(resetDebounceRef.current);
    resetDebounceRef.current = setTimeout(() => {
      setResetErrors({ email: validateEmail(text) });
    }, 500);
  };

  const handleSignUp = () => {
    // Validate all fields before submit
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const phoneError = validatePhone(formData.phone);
    const roleIdError = validateRoleId(formData.roleId);
    setSignupErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
      phone: phoneError,
      roleId: roleIdError,
    });
    if (nameError || emailError || passwordError || phoneError || roleIdError) {
      Alert.alert("Please fix the errors before submitting");
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
        <View style={styles.formContainer}>
          <DropdownInput
            label="Role"
            data={[
              { label: adminRole.name, value: adminRole._id },
              { label: clientRole.name, value: clientRole._id },
            ]}
            onSelect={(text) => handleSignupInputChange("roleId", text.value)}
            value={formData.roleId ? String(formData.roleId) : ""}
            containerStyle={{ margin: 0 }}
          />
          {signupErrors.roleId ? (
            <Text style={{ color: "red", fontSize: 12 }}>{signupErrors.roleId}</Text>
          ) : null}
          <CustomInput
            label="Full Name"
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => handleSignupInputChange("name", text)}
            autoCapitalize="words"
            error={signupErrors.name}
          />
          <CustomInput
            label="Phone Number"
            placeholder="Number"
            value={formData.phone}
            onChangeText={(text) => handleSignupInputChange("phone", text)}
            error={signupErrors.phone}
          />
          <CustomInput
            label="Email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleSignupInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={signupErrors.email}
          />
          <CustomInput
            label="Password"
            placeholder="Password"
            autoCapitalize="none"
            autoComplete="password-new"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleSignupInputChange("password", text)}
            secureTextToggle
            error={signupErrors.password}
          />
        </View>
      </View>
      <Button
        title="Sign up"
        onPress={handleSignUp}
        loading={isLoading}
        variant="primary"
        style={styles.mainButton}
      />
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
          <CustomInput
            label="Email"
            placeholder="Email"
            value={loginData.email}
            onChangeText={(text)=>handleLoginInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={loginErrors.email}
          />
          <CustomInput
            label="Password"
            placeholder="Password"
            value={loginData.password}
            onChangeText={(text)=>handleLoginInputChange("password", text)}
            secureTextEntry
            secureTextToggle
            autoCapitalize="none"
            autoComplete="password-new"
            error={loginErrors.password}
          />
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
        onPress={() => {
          // Validate before login
          const emailError = validateEmail(loginData.email);
          const passwordError = loginData.password ? "" : "Password is required";
          setLoginErrors({ email: emailError, password: passwordError });
          if (emailError || passwordError) {
            Alert.alert("Please fix the errors before submitting");
            return;
          }
          login(loginData);
        }}
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
        <CustomInput
            label="Email"
            placeholder="Email"
            value={resetEmail}
            onChangeText={handleResetInputChange}
            keyboardType="email-address"
            autoCapitalize="none"
            error={resetErrors.email}
          />
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
        return null;
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
