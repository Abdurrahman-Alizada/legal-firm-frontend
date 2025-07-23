import { CustomKeyboardAvoidingView } from "@/components/ui/CustomKeyboardAvoidingView";
import { ScreenHeader } from "@/components/ui/Headers";
import { JuliaLoader } from "@/components/ui/JuliaLoader";
import { colors, fonts, layout, spacing } from "@/constants";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useAIChatStore } from "@/services/aiChatStore";
import { isIosDevice } from "@/utils/helper";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Clipboard,
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";

const DRAWER_WIDTH = Math.min(320, Dimensions.get("window").width * 0.8);

const AIChatScreen = () => {
  const {
    sessions,
    fetchSessions,
    setCurrentSession,
    createSession,
    currentSessionId,
    currentSessionMessages,
    sendMessage,
    loading,
  } = useAIChatStore();
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);
  const drawerAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const { dismiss: dismissKeyboard } = useKeyboard();

  // Fetch sessions and set current session on mount or currentSessionId change
  useEffect(() => {
    fetchSessions().then(() => {
      if (!useAIChatStore.getState().sessions.length) {
        // No sessions, create one
        useAIChatStore.getState().createSession();
      } else if (!currentSessionId) {
        const mostRecent = useAIChatStore.getState().sessions[0];
        if (mostRecent && mostRecent._id !== currentSessionId) {
          setCurrentSession(mostRecent._id);
        }
      }
    });
  }, []);

  // Animate drawer
  useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: drawerOpen ? 0 : -DRAWER_WIDTH,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [drawerOpen]);

  // Scroll to end on new message
  useEffect(() => {
    if (currentSessionMessages?.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSessionMessages?.length]);

  // Scroll down after AI response is received
  useEffect(() => {
    if (currentSessionMessages?.length) {
      const lastMessage = currentSessionMessages[currentSessionMessages.length - 1];
      if (lastMessage && lastMessage.response && lastMessage.response.length > 0) {
        // Add a small delay to ensure the response is fully rendered
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
      }
    }
  }, [currentSessionMessages]);

  const handleSend = async () => {
    if (message.trim() && currentSessionId) {
      await sendMessage(message.trim(), currentSessionId);
      setMessage("");
      dismissKeyboard();
    }
  };

  const handleSessionPress = useCallback(
    async (id: string) => {
      setDrawerOpen(false);
      if (id !== currentSessionId) {
        await setCurrentSession(id);
      }
    },
    [currentSessionId]
  );

  const handleCreateNew = async () => {
    await createSession();
    const newSessionId = useAIChatStore.getState().currentSessionId;
    if (newSessionId) {
      setDrawerOpen(false);
    }
  };

  const handleLikeMessage = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleCopyMessage = async (text: string) => {
    try {
      await Clipboard.setString(text);
      ToastAndroid.show("Message copied to clipboard!", ToastAndroid.SHORT);
    } catch (error) {
      Alert.alert("Error", "Failed to copy message");
    }
  };

  const handleReportMessage = (messageId: string) => {
    Alert.alert(
      "Report Message",
      "Are you sure you want to report this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => {
            // TODO: Implement report functionality
            Alert.alert("Reported", "Message reported successfully!");
          },
        },
      ]
    );
  };

  const renderSession = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.sessionItem,
        item._id === currentSessionId && styles.activeSession,
      ]}
      onPress={() => handleSessionPress(item._id)}
    >
      <View style={styles.sessionIcon}>
        <Feather name="message-square" size={20} color={colors.primary} />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.sessionName || "Legal Consultation"}
        </Text>
        <Text style={styles.sessionDate}>
          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
        </Text>
      </View>
      {item._id === currentSessionId && (
        <Feather name="chevron-right" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderMessage = ({ item }: { item: any }) => (
    <View style={styles.messageGroup}>
      <View style={[styles.messageContainer, styles.userMessage]}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      {item?.response.length == 0 && loading ? (
        <JuliaLoader/>
      ) : (
        <View style={[styles.messageContainer, styles.assistantMessage]}>
          <Text style={styles.messageText}>{item.response}</Text>
          <View style={styles.messageActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                likedMessages.has(item._id) && styles.likedButton,
              ]}
              onPress={() => handleLikeMessage(item._id)}
            >
              <Feather
                name="thumbs-up"
                size={14}
                color={likedMessages.has(item._id) ? colors.primary : "#6B7280"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCopyMessage(item.response)}
            >
              <Feather name="copy" size={14} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleReportMessage(item._id)}
            >
              <Feather name="flag" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  // Get current session metadata
  const currentSessionMeta = sessions.find((s) => s._id === currentSessionId);

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer overlay */}
      {drawerOpen && (
        <Pressable
          style={styles.drawerOverlay}
          onPress={() => setDrawerOpen(false)}
        />
      )}
      {/* Side Drawer */}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <SafeAreaView style={{flex:1}}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Conversations</Text>
          <TouchableOpacity onPress={() => setDrawerOpen(false)}>
            <Feather name="x" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.drawerList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather
                name="message-square"
                size={48}
                color={colors.text.secondary}
              />
              <Text style={styles.emptyText}>No conversations yet</Text>
            </View>
          }
        />
        <TouchableOpacity style={styles.newButton} onPress={handleCreateNew}>
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.newButtonText}>New Conversation</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
      {/* Main Chat UI */}
        <CustomKeyboardAvoidingView style={{ flex: 1 }} offset={Platform.OS === 'ios' ? 0 : 0}>
        <ScreenHeader
          title={currentSessionMeta?.sessionName || "AI Chat"}
          onRight={
            <TouchableOpacity onPress={() => setDrawerOpen(true)}>
              <Feather name="menu" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          }
        />
          <FlatList
            ref={flatListRef}
            data={currentSessionMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather
                  name="message-square"
                  size={48}
                  color={colors.text.secondary}
                />
                <Text style={styles.emptyText}>
                  Ask Julia anything about legal matters
                </Text>
              </View>
            }
            onScrollBeginDrag={() => dismissKeyboard()}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type your legal question..."
              placeholderTextColor={colors.text.secondary}
              multiline
              editable={!loading}
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!message.trim() || loading}
            >
              <Feather
                name="send"
                size={24}
                color={message.trim() ? colors.primary : colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
          <SafeAreaView style={{backgroundColor:"#fff"}}/>
        </CustomKeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "white",
    zIndex: 10,
    elevation: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    zIndex: 9,
  },
  drawerHeader: {
    paddingTop: isIosDevice?0:StatusBar.currentHeight,
    marginTop:spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  drawerTitle: {
    fontSize: fonts.sizes.lg,
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  drawerList: {
    padding: spacing.md,
    paddingBottom: 0,
  },
  activeSession: {
    backgroundColor: colors.background.secondary,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: "white",
    borderRadius: layout.borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sessionDate: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    padding: spacing.sm,
    margin: spacing.md,
    borderRadius: layout.borderRadius.md,
  },
  newButtonText: {
    color: "white",
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.bold,
    marginLeft: spacing.sm,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  messagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  messageGroup: {
    marginBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  messageContainer: {
    marginBottom: spacing.sm,
    maxWidth: "92%",
    borderRadius: 18,
    padding: spacing.md,
    alignSelf: "flex-start",
    backgroundColor: "#F3F4F6",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#bccef5",
    borderBottomRightRadius: 6,
  },
  assistantMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  messageText: {
    fontSize: 15,
    color: "#374151",
  },
  messageTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  messageActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  likedButton: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.lg,
    padding: spacing.md,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: spacing.md,
    padding: spacing.sm,
  },
});

export default AIChatScreen;
