import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts, layout, spacing } from '../../constants';

export default function CalendarTab() {
  return (
    <View style={{ backgroundColor: colors.background.card, marginHorizontal: spacing.md, marginBottom: spacing.md, padding: spacing.md, borderRadius: layout.borderRadius.lg, ...layout.shadow.sm, alignItems: 'center' }}>
      <Ionicons name="calendar-outline" size={48} color={colors.primary} style={{ marginBottom: spacing.md }} />
      <Text style={{ fontSize: fonts.sizes.lg, fontWeight: fonts.weights.semibold, color: colors.text.primary, marginBottom: spacing.sm }}>Calendar</Text>
      <Text style={{ fontSize: fonts.sizes.sm, color: colors.text.secondary, textAlign: 'center' }}>The calendar feature is coming soon.</Text>
    </View>
  );
} 