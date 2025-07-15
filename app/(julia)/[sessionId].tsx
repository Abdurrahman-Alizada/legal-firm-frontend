import { colors, fonts, layout, spacing } from '@/constants';
import { ChatMessage, useChatStore } from '@/services/aiChatStore';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ChatScreen = () => {
  const { currentSession, sendMessage, loading } = useChatStore();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (currentSession?.messages?.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentSession?.messages]);

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.role === 'user' ? styles.userMessage : styles.assistantMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      keyboardVerticalOffset={80}
    >
      <FlatList
        ref={flatListRef}
        data={currentSession?.messages || []}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="message-square" size={48} color={colors.text.secondary} />
            <Text style={styles.emptyText}>Ask Julia anything about legal matters</Text>
          </View>
        }
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  messagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: layout.borderRadius.lg,
    marginBottom: spacing.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: layout.borderRadius.sm,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: layout.borderRadius.sm,
  },
  messageText: {
    fontSize: fonts.sizes.base,
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: fonts.sizes.xs,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.secondary,
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

export default ChatScreen;