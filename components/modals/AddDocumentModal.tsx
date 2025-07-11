import { colors, fonts, layout, spacing } from "@/constants";
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface DocumentFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

interface AddDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (documents: DocumentFile[], description: string) => Promise<void>;
  caseId?: string;
}

const AddDocumentModal = ({ 
  visible, 
  onClose, 
  onUpload, 
  caseId 
}: AddDocumentModalProps) => {
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<DocumentFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'image/*'
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.name || 'Unknown Document',
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size || 0,
        }));
        
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          name: `Image_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: 0, // Size not available for images
        }));
        
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('No Files', 'Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onUpload(selectedFiles, description);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset form
      setSelectedFiles([]);
      setDescription('');
      
      setTimeout(() => {
        onClose();
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      Alert.alert('Upload Failed', 'Failed to upload documents. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return 'image';
    if (type.includes('pdf')) return 'file-text';
    if (type.includes('word') || type.includes('document')) return 'file-text';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'file-text';
    return 'file';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} disabled={isUploading}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Upload Documents</Text>
          <TouchableOpacity 
            onPress={handleUpload} 
            disabled={selectedFiles.length === 0 || isUploading}
            style={selectedFiles.length === 0 || isUploading ? styles.disabledButton : null}
          >
            <Text style={[
              styles.uploadText,
              (selectedFiles.length === 0 || isUploading) && styles.disabledText
            ]}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Upload Progress */}
          {isUploading && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{uploadProgress}%</Text>
            </View>
          )}

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Add a description for these documents..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!isUploading}
            />
          </View>

          {/* File Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Files</Text>
            
            <View style={styles.uploadButtons}>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={pickDocument}
                disabled={isUploading}
              >
                <Feather name="file" size={24} color={colors.primary} />
                <Text style={styles.uploadButtonText}>Documents</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={pickImage}
                disabled={isUploading}
              >
                <Feather name="image" size={24} color={colors.primary} />
                <Text style={styles.uploadButtonText}>Images</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <View style={styles.filesContainer}>
                <Text style={styles.filesTitle}>
                  Selected Files ({selectedFiles.length})
                </Text>
                {selectedFiles.map((file, index) => (
                  <View key={index} style={styles.fileItem}>
                    <View style={styles.fileInfo}>
                      <Feather 
                        name={getFileIcon(file.type) as any} 
                        size={20} 
                        color={colors.text.secondary} 
                      />
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={styles.fileMeta}>
                          {file.type} • {formatFileSize(file.size)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => removeFile(index)}
                      disabled={isUploading}
                    >
                      <Feather name="x" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Supported Formats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Supported Formats</Text>
            <View style={styles.formatsContainer}>
              <Text style={styles.formatText}>• PDF Documents</Text>
              <Text style={styles.formatText}>• Word Documents (.doc, .docx)</Text>
              <Text style={styles.formatText}>• Excel Spreadsheets (.xls, .xlsx)</Text>
              <Text style={styles.formatText}>• Images (JPG, PNG, GIF)</Text>
              <Text style={styles.formatText}>• Text Files (.txt)</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  cancelText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
  },
  uploadText: {
    fontSize: fonts.sizes.base,
    color: colors.primary,
    fontWeight: fonts.weights.medium,
  },
  disabledText: {
    color: colors.text.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.background.secondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing.sm,
  },
  uploadButtonText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  filesContainer: {
    marginTop: spacing.md,
  },
  filesTitle: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.sm,
    marginBottom: spacing.xs,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  fileName: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    fontWeight: fonts.weights.medium,
  },
  fileMeta: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  formatsContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  formatText: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
});

export default AddDocumentModal; 