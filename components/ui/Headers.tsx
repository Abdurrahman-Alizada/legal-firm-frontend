import { colors, fonts, spacing } from "@/constants";
import { isIosDevice } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Search, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type TabHeaderProps = {
  title: string;
  onRight?: React.ReactNode;
  showSearch?: boolean;
  onSearchChange?: (text: string) => void;
};

const TabHeader: React.FC<TabHeaderProps> = ({
  title,
  onRight,
  showSearch = false,
  onSearchChange,
}) => {
  const [searchText, setSearchText] = useState("");
  const [visible, setVisible] = useState(false);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggleSearch = () => {
    const toValue = visible ? 0 : 1;
    setVisible(!visible);
    height.value = withTiming(toValue, { duration: 250 });
    opacity.value = withTiming(toValue, { duration: 250 });

    if (visible) {
      setSearchText("");
      onSearchChange?.("");
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value * 65,
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        paddingTop: isIosDevice ? undefined : StatusBar.currentHeight,
        backgroundColor: colors.background.primary,
      }}
    >
      <SafeAreaView />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showSearch && (
            <TouchableOpacity onPress={toggleSearch} style={styles.searchButton}>
              {visible ?<X size={22} color={colors.text.primary}/>:<Search size={22} color={colors.text.primary}/>}
            </TouchableOpacity>
          )}
          {onRight}
        </View>
      </View>

      {showSearch && (
        <Animated.View style={[styles.searchContainer, animatedStyle]}>
          <SafeAreaView style={styles.searchInputContainer}>
            <Search size={20} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search documents..."
              placeholderTextColor={colors.text.secondary}
              style={styles.searchInput}
              onChangeText={setSearchText}
              autoFocus={true}
            />
          </SafeAreaView>
        </Animated.View>
      )}
    </View>
  );
};

const ScreenHeader = ({ title, onRight, onBackPress=()=>router.back() }: { title: string; onRight?: any; onBackPress?:()=>void}) => {
  return (
    <View
      style={{
        backgroundColor: colors.background.primary,
        paddingTop: isIosDevice ? undefined : StatusBar.currentHeight,
      }}
    >
      <SafeAreaView />
      <View style={styles.header}>
        {onBackPress&&<TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>}
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
  searchButton: {
    backgroundColor: colors.background.secondary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  searchContainer: {
    overflow: "hidden",
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.primary,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: 30,
    paddingHorizontal: spacing.md,
    height: 50,
    marginTop: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex:1
  },
  searchClose: {
    padding: 4,
  },
});
