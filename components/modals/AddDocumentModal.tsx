import { colors, fonts, layout, spacing } from "@/constants";
import { caseService } from "@/services/api/caseService";
import { useCaseStore } from "@/services/caseStore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DocumentFile {
  uri: string;
  name: string;
  type: string;
  size: number;
  title?: string;
  description?: string;
}

interface AddDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  caseId?: string;
}

const AddDocumentModal = ({
  visible,
  onClose,
  caseId,
}: AddDocumentModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<DocumentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const {uploadDocument,selectedCase,fetchCaseById}=useCaseStore()
  const [isDragging, setIsDragging] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Animate on open
  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleDragEnter = () => setIsDragging(true);
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (result: any) => {
    setIsDragging(false);
    if (result.canceled || !result.assets) return;
    
    const asset = result.assets[0];
    const newFile = {
      uri: asset.uri,
      name: asset.name || `File_${Date.now()}`,
      type: asset.mimeType || "application/octet-stream",
      size: asset.size || 0,
    };
    setSelectedFiles([newFile]);
  };
  const pickDocument = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
          "image/*",
        ],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newFile = {
          uri: asset.uri,
          name: asset.name || "Unknown Document",
          type: asset.mimeType || "application/octet-stream",
          size: asset.size || 0,
        };
        setSelectedFiles([newFile]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const pickImage = async () => {
    try {
      const result: any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newFile = {
          uri: asset.uri,
          name: `Image_${Date.now()}.jpg`,
          type: "image/jpeg",
          size: 0,
        };
        setSelectedFiles([newFile]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFileField = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setSelectedFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, [field]: value } : file))
    );
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert("No Files", "Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const doc = selectedFiles[0];
      const formData = new FormData();
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Create file object with proper typing
      const file = {
        uri: doc.uri,
        name: doc.name,
        type: doc.type,
      } as unknown as Blob;
      
      formData.append("file", file);
      if (doc.title) formData.append("title", doc.title);
      if (doc.description) formData.append("description", doc.description);
      
      // Real upload progress handling
      await caseService.uploadDocument(selectedCase._id, formData);
      
      await fetchCaseById(selectedCase._id);
      
      // Success feedback
      setUploadProgress(100);
      setTimeout(() => {
        setSelectedFiles([]);
        onClose();
        setIsUploading(false);
      }, 800);
    } catch (error:any) {
      Alert.alert(
        "Upload Failed",
        error.message || "Failed to upload document. Please try again."
      );
    } finally {
      if (uploadProgress !== 100) {
        setIsUploading(false);
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "image";
    if (type.includes("pdf")) return "file-text";
    if (type.includes("word") || type.includes("document")) return "file-text";
    if (type.includes("excel") || type.includes("spreadsheet"))
      return "file-text";
    return "file";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onClose} 
            disabled={isUploading}
            style={styles.headerButton}
          >
            <Feather name="x" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Add Document</Text>
          
          <TouchableOpacity
            onPress={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            style={styles.headerButton}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Feather 
                name="upload" 
                size={20} 
                color={
                  selectedFiles.length === 0 || isUploading 
                    ? colors.text.primary 
                    : colors.primary
                } 
              />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Progress indicator */}
          {isUploading && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                {uploadProgress === 100 ? "Processing..." : "Uploading..."}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { 
                      width: `${uploadProgress}%`,
                      backgroundColor: uploadProgress === 100 
                        ? colors.success 
                        : colors.primary
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          )}

          {/* File Drop Zone */}
          <TouchableOpacity
            style={[
              styles.dropZone,
              isDragging && styles.dropZoneActive,
              selectedFiles.length > 0 && styles.dropZoneHidden
            ]}
            onPress={pickDocument}
            activeOpacity={0.7}
          >
            <View style={styles.dropZoneContent}>
              <MaterialIcons 
                name="cloud-upload" 
                size={48} 
                color={isDragging ? colors.primary : colors.text.secondary} 
              />
              <Text style={styles.dropZoneTitle}>
                {isDragging ? "Drop to upload" : "Select or drop files"}
              </Text>
              <Text style={styles.dropZoneSubtitle}>
                PDF, DOC, XLS, Images or Text files
              </Text>
              <View style={styles.uploadButtons}>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    pickDocument();
                  }}
                >
                  <Text style={styles.selectButtonText}>Browse Files</Text>
                </TouchableOpacity>
                <Text style={styles.orText}>or</Text>
                <TouchableOpacity 
                  style={styles.selectButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    pickImage();
                  }}
                >
                  <Text style={styles.selectButtonText}>Select Images</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* Selected File Preview */}
          {selectedFiles.length > 0 && (
            <View style={styles.filePreviewContainer}>
              <Text style={styles.sectionTitle}>Ready to upload</Text>
              
              {selectedFiles.map((file, index) => (
                <View key={index} style={styles.fileCard}>
                  <View style={styles.fileHeader}>
                    <View style={styles.fileIcon}>
                      <Feather 
                        name={getFileIcon(file.type) as any} 
                        size={20} 
                        color={colors.primary} 
                      />
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {file.name}
                      </Text>
                      <Text style={styles.fileMeta}>
                        {formatFileSize(file.size)} • {file.type.split('/')[1]?.toUpperCase() || "FILE"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <Feather name="x" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Title (optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Document title"
                      value={file.title || ""}
                      onChangeText={(text) =>
                        updateFileField(index, "title", text)
                      }
                      editable={!isUploading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Description (optional)</Text>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      placeholder="Add description"
                      value={file.description || ""}
                      onChangeText={(text) =>
                        updateFileField(index, "description", text)
                      }
                      editable={!isUploading}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={pickDocument}
                disabled={isUploading}
              >
                <Feather name="plus" size={18} color={colors.primary} />
                <Text style={styles.addMoreText}>Add another file</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload Button */}
          {selectedFiles.length > 0 && (
            <TouchableOpacity
              style={[
                styles.uploadButton,
                (isUploading || selectedFiles.length === 0) && styles.uploadButtonDisabled
              ]}
              onPress={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.uploadButtonText}>Upload Document</Text>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border.light,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerButton: {
    padding: spacing.xs,
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
  },
  progressLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.secondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  progressText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.md,
    backgroundColor: colors.background.secondary,
  },
  dropZoneActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(75, 118, 255, 0.05)',
  },
  dropZoneHidden: {
    display: 'none',
  },
  dropZoneContent: {
    alignItems: 'center',
    width: '100%',
  },
  dropZoneTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  dropZoneSubtitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  uploadButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  selectButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'white',
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  selectButtonText: {
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  orText: {
    marginHorizontal: spacing.sm,
    color: colors.text.secondary,
  },
  filePreviewContainer: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  fileCard: {
    backgroundColor: 'white',
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
  },
  fileMeta: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: layout.borderRadius.md,
    backgroundColor: 'white',
  },
  addMoreText: {
    marginLeft: spacing.sm,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  uploadButtonDisabled: {
    backgroundColor: colors.background.secondary,
    opacity: 0.6,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: fonts.weights.bold,
    fontSize: fonts.sizes.base,
  },
});

export default AddDocumentModal;