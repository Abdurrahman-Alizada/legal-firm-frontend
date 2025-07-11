import { colors, fonts, spacing } from "@/constants";
import { isIosDevice } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TabHeader = ({ title, onRight }: { title: string; onRight?: any }) => {
  return (
    <View style={{paddingTop: isIosDevice ? undefined : StatusBar.currentHeight, backgroundColor: colors.background.primary }}>
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        {onRight && onRight}
      </View>
    </View>
  );
};

const ScreenHeader = ({ title, onRight }: { title: string; onRight?: any }) => {
  return (
    <View
      style={{
        backgroundColor: colors.background.primary,
        paddingTop: isIosDevice ? undefined : StatusBar.currentHeight,
      }}
    >
      <SafeAreaView />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={styles.screenheaderTitle}>{title}</Text>
        {onRight ? onRight : <View style={styles.headerSpacer} />}
      </View>
    </View>
  );
};

export { ScreenHeader, TabHeader };

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: fonts.sizes["2xl"],
    fontWeight: fonts.weights.bold,
    color: colors.text.primary,
  },
  screenheaderTitle: {
    fontSize: fonts.sizes.base,
    fontWeight: fonts.weights.semibold,
    color: colors.text.primary,
  },
  backButton: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
});
