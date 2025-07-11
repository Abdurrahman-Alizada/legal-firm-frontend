import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, fonts, layout, spacing } from '../../constants';

export default function MessagesTab() {
  const [messageText, setMessageText] = useState('');
  const handleSendMessage = () => {
    setMessageText('');
  };
  return (
    <View style={{ backgroundColor: colors.background.card, marginHorizontal: spacing.md, marginBottom: spacing.md, padding: spacing.md, borderRadius: layout.borderRadius.lg, ...layout.shadow.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ width: 32, height: 32, backgroundColor: colors.primaryLight, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <Ionicons name="lock-closed" size={20} color={colors.text.secondary} />
        </View>
        <Text style={{ fontSize: fonts.sizes.lg, fontWeight: fonts.weights.semibold, color: colors.text.primary }}>Secure Messages</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: spacing.md }}>
        <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
          <Text style={{ fontSize: fonts.sizes.xs, color: colors.text.white, fontWeight: fonts.weights.medium }}>AES-256 Encrypted</Text>
        </View>
        <View style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 }}>
          <Text style={{ fontSize: fonts.sizes.xs, color: colors.primary, fontWeight: fonts.weights.medium }}>End-to-End</Text>
        </View>
      </View>
      {/* Message from Dr. Beltran */}
      <View style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: fonts.sizes.base, fontWeight: fonts.weights.semibold, color: colors.primary }}>D</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fonts.sizes.base, fontWeight: fonts.weights.semibold, color: colors.text.primary, marginBottom: 4 }}>Dr. Beltran</Text>
            <Text style={{ fontSize: fonts.sizes.sm, color: colors.text.secondary, lineHeight: 20, marginBottom: 8 }}>
              Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: fonts.sizes.xs, color: colors.text.light }}>11:29 am</Text>
              <View style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: fonts.weights.medium }}>Encrypted</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* Message from Margarito Alonzo */}
      <View style={{ marginBottom: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: fonts.sizes.base, fontWeight: fonts.weights.semibold, color: colors.primary }}>M</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fonts.sizes.base, fontWeight: fonts.weights.semibold, color: colors.text.primary, marginBottom: 4 }}>Margarito Alonzo</Text>
            <Text style={{ fontSize: fonts.sizes.sm, color: colors.text.secondary, lineHeight: 20, marginBottom: 8 }}>
              Lorem ipsum dolor sit amet consectetur. Consequat laoreet sit pharetra maecenas sed sit cursibus. Consequat vitae velit egestas duis risus blandit pretium at.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: fonts.sizes.xs, color: colors.text.light }}>11:24 am</Text>
              <View style={{ backgroundColor: colors.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: fonts.weights.medium }}>Encrypted</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/* Message Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border.light, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: spacing.md }}>
        <TextInput
          style={{ flex: 1, fontSize: fonts.sizes.sm, color: colors.text.primary, minHeight: 20 }}
          placeholder="Message..."
          value={messageText}
          onChangeText={setMessageText}
          placeholderTextColor={colors.text.light}
          multiline
        />
        <TouchableOpacity style={{ marginLeft: 8 }} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
} 