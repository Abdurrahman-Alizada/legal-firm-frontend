import { HapticTab } from '@/components/ui/HapticTab';
import { colors } from '@/constants';
import { usePushNotifications } from '@/hooks/useNotifications';
import { sendExpoTokenToBackend } from '@/services/api/userService';
import { useAuthStore } from '@/services/authStore';
import { Tabs } from 'expo-router';
import { Briefcase, FileText, Home, MessageCircle, User, Users } from 'lucide-react-native';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const {user,isAuthenticated}=useAuthStore()
  const expoPushToken=usePushNotifications()
  useEffect(()=>{
    if(user&&expoPushToken){
      sendExpoTokenToBackend(expoPushToken)
    }
  },[user,expoPushToken])
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: Platform.OS=="ios"?4:0
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cases"
        options={{
          title: 'Cases',
          tabBarIcon: ({ size, color }) => (
            <Briefcase size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients" 
        options={{
          title: 'Clients',
          href:null,
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'Employees',
          href:isAuthenticated==="admin"?undefined:null,
          tabBarIcon: ({ size, color }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="documents"
        
        options={{
          title: 'Docs',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

