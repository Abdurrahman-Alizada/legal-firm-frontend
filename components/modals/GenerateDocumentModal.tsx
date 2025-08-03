import { colors, fonts, spacing } from "@/constants";
import { generateClientIntakeRequest, generateCourtFilingRequest, generateMedicalRequest, generateSettlementAgreement } from "@/services/api/caseService";
import { useAuthStore } from "@/services/authStore";
import { useCaseStore } from "@/services/caseStore";
import { useDocumentStore } from "@/services/documentStore";
import { handleOpenDocument } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { BriefcaseMedical, Handshake, Scale, UserPlus } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated, Easing, Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";

type FieldConfig = {
  key: string;
  label: string;
  type?: "date";
  icon?: keyof typeof Ionicons.glyphMap;
};

type DocumentType = any;

export const documentFieldConfigs: Record<DocumentType, FieldConfig[]> = {
  "Settlement Agreement": [
    { key: "date", label: "Date", type: "date", icon: "calendar" },
    { key: "claimantName", label: "Claimant Name", icon: "person" },
    { key: "claimantAddress", label: "Claimant Address", icon: "location" },
    { key: "defendantName", label: "Defendant Name", icon: "person" },
    {
      key: "dateOfIncident",
      label: "Date of Incident",
      type: "date",
      icon: "calendar",
    },
    { key: "settlementAmount", label: "Settlement Amount", icon: "cash" },
    { key: "governingState", label: "Governing State", icon: "flag" },
  ],
  "Medical Records Request": [
    { key: "healthcareProvider", label: "Healthcare Provider", icon: "medkit" },
    { key: "providerAddress", label: "Provider Address", icon: "location" },
    { key: "patientName", label: "Patient Name", icon: "person" },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      icon: "calendar",
    },
    {
      key: "recordsFromDate",
      label: "Records From",
      type: "date",
      icon: "calendar",
    },
    {
      key: "recordsToDate",
      label: "Records To",
      type: "date",
      icon: "calendar",
    },
    {
      key: "specificRecords",
      label: "Specific Records",
      icon: "document-text",
    },
  ],
  "Court Filing Request": [
    { key: "caseNumber", label: "Case Number", icon: "document-text" },
    { key: "courtName", label: "Court Name", icon: "business" },
    { key: "motionType", label: "Motion Type", icon: "create" },
    { key: "plainTiff", label: "Plaintiff", icon: "person" },
    { key: "Defendant", label: "Defendant", icon: "person" },
    { key: "reliefSought", label: "Relief Sought", icon: "help-circle" },
    {
      key: "supportingFacts",
      label: "Supporting Facts",
      icon: "information-circle",
    },
    { key: "submittedBy", label: "Submitted By", icon: "person" },
    { key: "date", label: "Date", type: "date", icon: "calendar" },
  ],
  "Client Intake Request": [
    { key: "fullName", label: "Full Name", icon: "person" },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      icon: "calendar",
    },
    { key: "phoneNumber", label: "Phone Number", icon: "call" },
    { key: "emailAddress", label: "Email Address", icon: "mail" },
    { key: "streetAddress", label: "Street Address", icon: "home" },
    { key: "city", label: "City", icon: "business" },
    { key: "state", label: "State", icon: "flag" },
    { key: "zip", label: "ZIP Code", icon: "pin" },
    {
      key: "dateOfIncident",
      label: "Date of Incident",
      type: "date",
      icon: "calendar",
    },
    {
      key: "locationOfIncident",
      label: "Location of Incident",
      icon: "location",
    },
    {
      key: "descriptionOfIncident",
      label: "Description of Incident",
      icon: "document-text",
    },
    { key: "injuiresSustained", label: "Injuries Sustained", icon: "medkit" },
    { key: "medicalProviders", label: "Medical Providers", icon: "people" },
    { key: "insuranceCompany", label: "Insurance Company", icon: "shield" },
    { key: "policyNumber", label: "Policy Number", icon: "barcode" },
    { key: "attorneyNotes", label: "Attorney Notes", icon: "document" },
  ],
};

type GenerateDocumentModalProps = {
  visible: boolean;
  onClose: () => void;
};

const documentTypes: DocumentType[] = [
  "Settlement Agreement",
  "Medical Records Request",
  "Court Filing Request",
  "Client Intake Request"
];

const GenerateDocumentModal: React.FC<GenerateDocumentModalProps> = ({
  visible,
  onClose,
}) => {
  const { user } = useAuthStore();
  const { selectedCase } = useCaseStore();
  const documentStore = useDocumentStore();
  const [docType, setDocType] = useState<DocumentType | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentDateKey, setCurrentDateKey] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const config = docType ? documentFieldConfigs[docType] || [] : [];

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
      setDocType(null);
      setFields({});
    }
  }, [visible]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectDocType = (type: DocumentType) => {
    setDocType(type);
    setDropdownVisible(false);
    setFields({});
  };

  const handleChange = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = (date: Date) => {
    if (currentDateKey) {
      handleChange(currentDateKey, date.toISOString().split("T")[0]);
      setCurrentDateKey(null);
    }
    setShowDatePicker(false);
  };

  const openDatePicker = (key: string) => {
    setCurrentDateKey(key);
    setShowDatePicker(true);
  };

  const handleSubmit = async() => {
    if (!docType) {
      Toast.show({ type: "error", text1: "Please select a document type" });
      return;
    }
    setLoading(true)
      try {
        let apiRes;
        if (docType === "Settlement Agreement") {
          apiRes = await generateSettlementAgreement(user?.id!, fields);
        } else if (docType === "Medical Records Request") {
          apiRes = await generateMedicalRequest(user?.id!, fields);
        } else if (docType === "Court Filing Request") {
          apiRes = await generateCourtFilingRequest(user?.id!, fields);
        } else if (docType === "Client Intake Request") {
          apiRes = await generateClientIntakeRequest(user?.id!, fields);
        }
        const pdfUrl = apiRes?.data?.url;
        if (pdfUrl) {
          documentStore.addDocument({
            name:docType ,
            description:
              fields.description || "Generated document for " + (fields?.fullName||fields?.courtName||fields?.claimantName||fields?.patientName),
            url: pdfUrl,
            docType: docType!,
            caseName: selectedCase?.title || selectedCase?.clientName || "",
            createdAt: new Date().toISOString(),
            fields,
          });
        }
        Toast.show({
          type: "success",
          text1: `${docType} generated and saved!`,
        });
        handleOpenDocument(apiRes?.data?.url);
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: err.message || "Failed to generate document",
        });
      } finally {
        setLoading(false);
        onClose();
        setFields({});
      }
  };

  const getDocTypeIcon = (type: DocumentType) => {
    switch (type) {
      case "Settlement Agreement": return <Handshake size={20} color={colors.primary} />;
      case "Medical Records Request": return <BriefcaseMedical size={20} color={colors.primary} />;
      case "Court Filing Request": return <Scale size={20} color={colors.primary} />;
      case "Client Intake Request": return <UserPlus size={20} color={colors.primary} />;
      default: return "document-text";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={24} color={colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Generate Document</Text>
            {loading?<ActivityIndicator size="small" color={colors.primary} />:<TouchableOpacity onPress={handleSubmit} style={styles.iconButton}>
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            </TouchableOpacity>}
          </View>
          
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {/* Document Type Selector */}
              <TouchableOpacity 
                style={styles.dropdownSelector}
                onPress={toggleDropdown}
              >
                <View style={styles.selectorContent}>
                  {docType ? (
                    <>
                      {getDocTypeIcon(docType) as any}
                      <Text style={styles.selectedType}>{docType}</Text>
                    </>
                  ) : (
                    <Text style={styles.placeholder}>Select document type</Text>
                  )}
                  <Ionicons 
                    name={dropdownVisible ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.text.secondary} 
                  />
                </View>
              </TouchableOpacity>
              
              {dropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {documentTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.dropdownItem}
                      onPress={() => selectDocType(type)}
                    >
                     {getDocTypeIcon(type) as any}
                      <Text style={styles.dropdownItemText}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* Form Fields */}
              {docType && config.map((field: any) => {
                const iconName = field.icon ?? "document-text";
                const value = fields[field.key] || "";

                if (field.type === "date") {
                  return (
                    <TouchableOpacity
                      key={field.key}
                      style={styles.inputWrapper}
                      onPress={() => openDatePicker(field.key)}
                    >
                      <Ionicons
                        name={iconName}
                        size={20}
                        color={colors.text.secondary}
                        style={styles.inputIcon}
                      />
                      <Text style={value ? styles.inputText : styles.placeholderText}>
                        {value || field.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }

                return (
                  <View key={field.key} style={styles.inputWrapper}>
                    <Ionicons
                      name={iconName}
                      size={20}
                      color={colors.text.secondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder={field.label}
                      placeholderTextColor={colors.text.secondary}
                      style={styles.input}
                      value={value}
                      onChangeText={(text) => handleChange(field.key, text)}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>
          
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setShowDatePicker(false)}
          />
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: fonts.sizes.xl,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  iconButton: {
    padding: spacing.sm,
  },
  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  dropdownSelector: {
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedType: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    fontWeight: fonts.weights.medium,
  },
  placeholder: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
  },
  placeholderText: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    paddingVertical: 8,
  },
  dropdownMenu: {
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  dropdownItemText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: spacing.sm,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    paddingVertical: 8,
  },
  inputText: {
    flex: 1,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    paddingVertical: 8,
  },
});

export default GenerateDocumentModal;