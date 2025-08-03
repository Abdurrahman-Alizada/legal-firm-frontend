import { ScreenHeader } from "@/components/ui/Headers";
import { ChatSkeleton } from "@/components/ui/Skeletons";
import { colors, fonts, layout, spacing } from "@/constants";
import { useAuthStore } from "@/services/authStore";
import { useCaseStore } from "@/services/caseStore";
import { useChatStore } from "@/services/chatStore";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ChatScreen = () => {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const { cases } = useCaseStore();
  const { user } = useAuthStore();
  const { threads, messages, loading, error, sendMessage, fetchMessages } =
    useChatStore();
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const currentUserId = user?.id || "";
  const caseMessages = messages[threadId] || [];
  const thread:any = threads.find((t) => t._id === threadId);
  const selectedCase = thread
    ? cases.find((item) => item._id === thread?.case?._id)
    : null;

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    if (threadId) {
      fetchMessages(threadId);
    }
  }, [threadId]);

  const handleSend = async () => {
    if (message.trim() && thread) {
      await sendMessage(thread.scope, threadId, message);
      setMessage("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isCurrentUser = item.sender?._id === currentUserId || item.senderId == currentUserId;
    const isSystem = item.sender?.name === "system";

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          isSystem && styles.systemMessage,
        ]}
      >
        {!isCurrentUser && !isSystem && (
          <Text style={styles.senderName}>{item.sender?.name}</Text>
        )}
        <View
          style={[
            styles.messageBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
            isSystem && styles.systemBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
              isSystem && styles.systemText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        <Text style={styles.messageTime}>
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader onBackPress={()=>router.dismissTo('/chats')} title={selectedCase?.title || thread?.clientCompany?.name.replace("'s Firm","") || "chat"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        {loading && !caseMessages.length ? (
          <ChatSkeleton />
        ) : (
          <FlatList
            ref={flatListRef}
            data={caseMessages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.messagesContainer}
            inverted={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Feather
                  name="message-square"
                  size={48}
                  color={colors.text.secondary}
                />
                <Text style={styles.emptyText}>No messages yet</Text>
                <Text style={styles.emptySubtext}>Start the conversation</Text>
              </View>
            }
            ListFooterComponent={
              error ? (
                <View style={styles.errorContainer}>
                  <MaterialIcons
                    name="error-outline"
                    size={25}
                    color={colors.error}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : undefined
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor={colors.text.secondary}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Feather
              name="send"
              size={24}
              color={message.trim() ? colors.primary : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
  errorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  errorText: {
    fontSize: fonts.sizes.lg,
    color: colors.error,
  },
  messagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: spacing.xs,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  systemMessage: {
    alignSelf: "center",
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: layout.borderRadius.lg,
    ...layout.shadow.sm,
  },
  currentUserBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: layout.borderRadius.sm,
  },
  otherUserBubble: {
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: layout.borderRadius.sm,
  },
  systemBubble: {
    backgroundColor: colors.background.primary,
    borderRadius: layout.borderRadius.md,
  },
  messageText: {
    fontSize: fonts.sizes.base,
  },
  currentUserText: {
    color: colors.text.white,
  },
  otherUserText: {
    color: colors.text.primary,
  },
  systemText: {
    color: colors.text.secondary,
    fontStyle: "italic",
  },
  senderName: {
    fontSize: fonts.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingVertical: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.borderRadius.lg,
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
    ...layout.shadow.sm,
  },
  sendButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: fonts.sizes.xl,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
});

export default ChatScreen;
