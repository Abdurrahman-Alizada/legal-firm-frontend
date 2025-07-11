import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default Layout;

const styles = StyleSheet.create({});
