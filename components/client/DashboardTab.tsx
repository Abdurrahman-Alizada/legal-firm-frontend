// import AddDocumentModal from "@/components/modals/AddDocumentModal";
// import { spacing } from "@/constants";
// import { useCaseStore } from "@/services/caseStore";
// import { Ionicons } from "@expo/vector-icons";
// import * as Linking from "expo-linking";
// import { router } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   Animated,
//   Easing,
//   Image,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";

// export default function DashboardTab() {
//   const [messageText, setMessageText] = useState("");
//   const [assistantMessage, setAssistantMessage] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const { cases, fetchCases, fetchCaseById, selectedCase, isLoading } = useCaseStore();
//   const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
//   const [loadingCase, setLoadingCase] = useState(false);
//   const activeCase = cases.find((c) => c._id === activeCaseId) || cases[0];
//   const [progressAnim] = useState(new Animated.Value(0));

//   useEffect(() => {
//     fetchCases();
//   }, []);

//   useEffect(() => {
//     if (cases.length && !activeCaseId) {
//       setActiveCaseId(cases[0]._id);
//     }
//   }, [cases]);

//   // Fetch full details when activeCaseId changes
//   useEffect(() => {
//     if (activeCaseId) {
//       setLoadingCase(true);
//       fetchCaseById(activeCaseId).finally(() => setLoadingCase(false));
//     }
//   }, [activeCaseId]);

//   // Animate progress bar on status change
//   useEffect(() => {
//     if (!selectedCase) return;
//     let progress = 0;
//     if (selectedCase.status === "pending") progress = 0.2;
//     else if (selectedCase.status === "active") progress = 0.6;
//     else if (selectedCase.status === "closed") progress = 1;
//     Animated.timing(progressAnim, {
//       toValue: progress,
//       duration: 600,
//       easing: Easing.inOut(Easing.ease),
//       useNativeDriver: false,
//     }).start();
//   }, [selectedCase?.status]);

//   const handleSelectFiles = () => {
//     // Handle file selection logic
//     console.log("Select files clicked");
//   };

//   const handleUploadFirstDocument = () => {
//     // Handle first document upload
//     console.log("Upload first document clicked");
//   };

//   const handlePayOutsideBalance = () => {
//     // Handle payment logic
//     console.log("Pay outside balance clicked");
//   };

//   const handleSendMessage = () => {
//     // Handle message sending
//     console.log("Send message:", messageText);
//     setMessageText("");
//   };

//   const handleSendAssistantMessage = () => {
//     // Handle assistant message sending
//     console.log("Send assistant message:", assistantMessage);
//     setAssistantMessage("");
//   };

//   const handleScheduleAppointment = () => {
//     // Handle appointment scheduling
//     console.log("Schedule appointment clicked");
//   };

//   const handleSendMessageToOffice = () => {
//     // Handle sending message to office
//     console.log("Send message to office clicked");
//   };

//   // Document open handler (view/download)
//   const handleOpenDocument = async (doc: { url?: string; type?: string; title?: string; name?: string; description?: string; _id?: string }) => {
//     if (!doc?.url) return;
//     await Linking.openURL(doc.url);
//   };

//   // Firm info (placeholder if only companyId)
//   const renderFirmInfo = () => (
//     <View style={styles.firmCard}>
//       <View style={styles.firmAvatar}>
//         <Image source={require("@/assets/images/lawyer.png")} style={{ width: 40, height: 40, borderRadius: 20 }} />
//       </View>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.firmName}>Firm ID: {selectedCase?.companyId || "-"}</Text>
//         <Text style={styles.firmType}>Legal Firm</Text>
//       </View>
//     </View>
//   );

//   // Summary card for selected case
//   const renderCaseSummary = () => (
//     <View style={styles.summaryCard}>
//       <Text style={styles.summaryTitle}>{selectedCase?.title || "Untitled Case"}</Text>
//       <View style={styles.summaryRow}>
//         <Text style={[styles.summaryStatus, { color: selectedCase?.status === "active" ? "#22c55e" : selectedCase?.status === "pending" ? "#f59e42" : "#6b7280" }]}>{selectedCase?.status?.toUpperCase()}</Text>
//         <Text style={[styles.summaryPriority, { color: selectedCase?.status === "active" ? "#22c55e" : selectedCase?.status === "pending" ? "#f59e42" : "#6b7280" }]}>{selectedCase?.priority?.toUpperCase()}</Text>
//       </View>
//       <Text style={styles.summaryClient}>Client: {selectedCase?.clientName || "-"}</Text>
//       <Text style={styles.summaryDate}>Created: {selectedCase?.createdAt ? new Date(selectedCase.createdAt).toLocaleDateString() : "-"}</Text>
//       {selectedCase?.description && <Text style={styles.summaryDesc} numberOfLines={2}>{selectedCase.description}</Text>}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Case Selector */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.caseSelectorScroll} contentContainerStyle={styles.caseSelectorContainer}>
//         {cases.map((c) => (
//           <TouchableOpacity
//             key={c._id}
//             style={[styles.casePill, selectedCase?._id === c._id && styles.casePillActive]}
//             onPress={() => setActiveCaseId(c._id)}
//           >
//             <Text style={[styles.casePillText, selectedCase?._id === c._id && styles.casePillTextActive]} numberOfLines={1}>{c.title}</Text>
//             <View style={[styles.statusDot, { backgroundColor: c.status === "active" ? "#22c55e" : c.status === "pending" ? "#f59e42" : "#6b7280" }]} />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//       {/* Progress Bar */}
//       <View style={styles.progressBarContainer}>
//         <Animated.View style={[styles.progressBar, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["8%", "100%"] }) }]} />
//         <View style={styles.progressBarLabels}>
//           <Text style={styles.progressLabel}>Pending</Text>
//           <Text style={styles.progressLabel}>Active</Text>
//           <Text style={styles.progressLabel}>Closed</Text>
//         </View>
//       </View>
//       {/* Firm Info */}
//       {selectedCase && renderFirmInfo()}
//       {/* Case Summary */}
//       {loadingCase || isLoading ? (
//         <View style={{ alignItems: 'center', marginVertical: 16 }}><Text>Loading case details...</Text></View>
//       ) : (
//         selectedCase && renderCaseSummary()
//       )}
//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         {/* Shared Document */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardIconContainer}>
//               <Ionicons name="document-text" size={20} color="#3B82F6" />
//             </View>
//             <Text style={styles.cardTitle}>Shared Document</Text>
//           </View>
//           <Text style={styles.cardDescription}>Document shared with you by our legal team</Text>
//         </View>
//         {/* Document Upload & List */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardIconContainer}>
//               <Ionicons name="cloud-upload-outline" size={20} color="#6B7280" />
//             </View>
//             <Text style={styles.cardTitle}>Document Upload</Text>
//             <TouchableOpacity style={[styles.selectFilesButton, { marginLeft: 'auto' }]} onPress={() => setShowUploadModal(true)}>
//               <Ionicons name="attach-outline" size={16} color="#3B82F6" />
//               <Text style={styles.selectFilesText}>Upload</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.documentsSection}>
//             <Text style={styles.documentsTitle}>Your Documents {(selectedCase?.documents ? `(${selectedCase.documents.length})` : "")}</Text>
//             {selectedCase?.documents && selectedCase.documents.length > 0 ? (
//               selectedCase.documents.map((doc: { url?: string; type?: string; title?: string; name?: string; description?: string; _id?: string }, idx: number) => (
//                 <TouchableOpacity key={doc._id || idx} style={styles.documentCard} onPress={() => handleOpenDocument(doc)}>
//                   <View style={styles.documentPreview}>
//                     {doc.type === "image" ? (
//                       <Ionicons name="image-outline" size={32} color="#6B7280" />
//                     ) : (
//                       <Ionicons name="document-outline" size={32} color="#6B7280" />
//                     )}
//                   </View>
//                   <View style={styles.documentInfo}>
//                     <Text style={styles.documentName} numberOfLines={1}>{doc.title || doc.name || `Document ${idx + 1}`}</Text>
//                     <Text style={styles.documentMeta}>{doc.description ? doc.description + " • " : ""}{doc.type ? doc.type.toUpperCase() : "FILE"}</Text>
//                   </View>
//                   <TouchableOpacity style={styles.documentAction} onPress={() => handleOpenDocument(doc)}>
//                     <Ionicons name="download-outline" size={20} color="#3B82F6" />
//                   </TouchableOpacity>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <View style={styles.emptyDocuments}>
//                 <Ionicons name="document-outline" size={48} color="#D1D5DB" />
//                 <Text style={styles.emptyDocumentsText}>No documents uploaded yet</Text>
//                 <TouchableOpacity style={styles.uploadFirstButton} onPress={() => setShowUploadModal(true)}>
//                   <Text style={styles.uploadFirstButtonText}>Upload Your First Document</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//         {/* Billing & Invoices */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardIconContainer}>
//               <Ionicons name="card-outline" size={20} color="#6B7280" />
//             </View>
//             <Text style={styles.cardTitle}>Billing & Invoices</Text>
//           </View>
//           <View style={styles.balanceSection}>
//             <View style={styles.balanceRow}>
//               <View>
//                 <Text style={styles.balanceLabel}>Current Balance</Text>
//                 <Text style={styles.balanceDate}>Last updated: March 1, 2024</Text>
//               </View>
//               <Text style={styles.balanceAmount}>$0</Text>
//             </View>
//             <Text style={styles.recentInvoicesText}>Recent Invoices</Text>
//             <TouchableOpacity style={styles.payButton} onPress={() => {}}>
//               <Ionicons name="card" size={16} color="#ffffff" />
//               <Text style={styles.payButtonText}>Pay Outside Balance</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* Julia Legal Assistant */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <View style={styles.cardIconContainer}>
//               <Ionicons name="library-outline" size={20} color="#6B7280" />
//             </View>
//             <Text style={styles.cardTitle}>Julia Legal Assistant</Text>
//           </View>
//           <View style={styles.assistantMessage}>
//             <View style={styles.assistantAvatar}>
//               <Text style={styles.assistantAvatarText}>J</Text>
//             </View>
//             <View style={styles.assistantContent}>
//               <Text style={styles.assistantText}>Your AI-powered legal assistant. Get instant help or schedule a session.</Text>
//               <View style={styles.assistantActions}>
//                 <TouchableOpacity style={styles.assistantButton} onPress={() => router.push('/(screens)/julia')}>
//                   <Text style={styles.assistantButtonText}>Open Julia Assistant</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//       {/* Document Upload Modal */}
//       <AddDocumentModal visible={showUploadModal} onClose={() => setShowUploadModal(false)} caseId={selectedCase?._id} />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollView: {
//     flex: 1,
//     paddingVertical: 16,
//   },
//   welcomeCard: {
//     backgroundColor: "#ffffff",
//     margin: 16,
//     marginBottom: 16,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   welcomeContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   welcomeSubtitle: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 2,
//   },
//   caseTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     margin:spacing.sm,
//     color: "#111827",
//   },
//   welcomeIcons: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   cardIconContainer: {
//     width: 32,
//     height: 32,
//     backgroundColor: "#EFF6FF",
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginLeft: 44,
//   },
//   uploadArea: {
//     alignItems: "center",
//     paddingVertical: 32,
//     borderWidth: 2,
//     borderColor: "#E5E7EB",
//     borderStyle: "dashed",
//     borderRadius: 8,
//     marginVertical: 16,
//   },
//   uploadTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginTop: 12,
//     marginBottom: 8,
//   },
//   uploadDescription: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   selectFilesButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//     marginBottom: 12,
//   },
//   selectFilesText: {
//     fontSize: 14,
//     color: "#3B82F6",
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   encryptionText: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   documentsSection: {
//     marginTop: 16,
//   },
//   documentsTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 16,
//   },
//   emptyDocuments: {
//     alignItems: "center",
//     paddingVertical: 32,
//   },
//   emptyDocumentsText: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginTop: 12,
//     marginBottom: 16,
//   },
//   uploadFirstButton: {
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#3B82F6",
//   },
//   uploadFirstButtonText: {
//     fontSize: 14,
//     color: "#3B82F6",
//     fontWeight: "600",
//   },
//   balanceSection: {
//     marginTop: 8,
//   },
//   balanceRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   balanceLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   balanceDate: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },
//   balanceAmount: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   recentInvoicesText: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 16,
//   },
//   payButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#3B82F6",
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 8,
//   },
//   payButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#ffffff",
//   },
//   encryptionBadges: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 16,
//   },
//   encryptionBadge: {
//     backgroundColor: "#E0F2FE",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   encryptionBadgeText: {
//     fontSize: 12,
//     color: "#0369A1",
//     fontWeight: "500",
//   },
//   messageContainer: {
//     marginBottom: 16,
//   },
//   messageHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//   },
//   messageAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#E0F2FE",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   messageAvatarText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#0369A1",
//   },
//   messageInfo: {
//     flex: 1,
//   },
//   messageName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   messageContent: {
//     fontSize: 14,
//     color: "#6B7280",
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   messageFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   messageTime: {
//     fontSize: 12,
//     color: "#9CA3AF",
//   },
//   encryptedBadge: {
//     backgroundColor: "#E0F2FE",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   encryptedBadgeText: {
//     fontSize: 10,
//     color: "#0369A1",
//     fontWeight: "500",
//   },
//   messageInputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginTop: 16,
//   },
//   messageInput: {
//     flex: 1,
//     fontSize: 14,
//     color: "#111827",
//     minHeight: 20,
//   },
//   sendButton: {
//     marginLeft: 8,
//   },
//   assistantMessage: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     marginBottom: 16,
//   },
//   assistantAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#3B82F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   assistantAvatarText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#ffffff",
//   },
//   assistantContent: {
//     flex: 1,
//   },
//   assistantText: {
//     fontSize: 14,
//     color: "#6B7280",
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   assistantActions: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   assistantButton: {
//     backgroundColor: "#EFF6FF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#3B82F6",
//   },
//   assistantButtonText: {
//     fontSize: 12,
//     color: "#3B82F6",
//     fontWeight: "600",
//   },
//   assistantNote: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginTop: 8,
//   },
//   assistantNoteText: {
//     fontSize: 12,
//     color: "#6B7280",
//     flex: 1,
//   },
//   documentCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   documentPreview: {
//     width: 48,
//     height: 48,
//     borderRadius: 8,
//     marginRight: 12,
//     backgroundColor: "#F3F4F6",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   documentInfo: {
//     flex: 1,
//   },
//   documentName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   documentMeta: {
//     fontSize: 12,
//     color: "#6B7280",
//   },
//   documentAction: {
//     padding: 8,
//   },
//   caseSelectorScroll: {
//     maxHeight: 60,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   caseSelectorContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 8,
//     gap: 8,
//   },
//   casePill: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 20,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     marginRight: 8,
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   casePillActive: {
//     backgroundColor: '#3B82F6',
//     borderColor: '#3B82F6',
//   },
//   casePillText: {
//     fontSize: 15,
//     color: '#374151',
//     fontWeight: '600',
//     marginRight: 8,
//     maxWidth: 100,
//   },
//   casePillTextActive: {
//     color: '#fff',
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginLeft: 2,
//   },
//   progressBarContainer: {
//     height: 24,
//     marginHorizontal: 16,
//     marginTop: 8,
//     marginBottom: 8,
//     justifyContent: 'center',
//   },
//   progressBar: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#3B82F6',
//   },
//   progressBarLabels: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   progressLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   firmCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F3F4F6',
//     marginHorizontal: 16,
//     marginBottom: 12,
//     padding: 12,
//     borderRadius: 12,
//     gap: 12,
//   },
//   firmAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   firmName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   firmType: {
//     fontSize: 13,
//     color: '#6B7280',
//   },
//   summaryCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 12,
//     padding: 16,
//     borderRadius: 12,
//     ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 }, android: { elevation: 2 } }),
//   },
//   summaryTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//     marginBottom: 4,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   summaryStatus: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginRight: 12,
//   },
//   summaryPriority: {
//     fontSize: 13,
//     color: '#3B82F6',
//     fontWeight: '600',
//     marginRight: 12,
//   },
//   summaryClient: {
//     fontSize: 14,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   summaryDate: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginBottom: 2,
//   },
//   summaryDesc: {
//     fontSize: 13,
//     color: '#374151',
//     marginTop: 2,
//   },
// });
