import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Owner {
  name?: string;
  email?: string;
}

interface Company {
  _id: string;
  name?: string;
  type?: string;
  owner?: Owner;
}

interface Props {
  id: string;
  name: string;
  type: string;
  owner?: {
    name?: string;
    email?: string;
  };
  onPress: (id: string) => void;
  loadingId: any;
}

const CompanyCard: React.FC<Props> = ({
  id,
  name,
  type,
  owner,
  onPress,
  loadingId,
}) => {
  const isPerson = type?.toLowerCase() === "person";
  const ownerName = owner?.name || "N/A";
  const ownerEmail = owner?.email || "No email provided";

  return (
    <View style={styles.card}>
      <Image
        source={type=="Client"?require("@/assets/images/user.png"):require("@/assets/images/lawyer.png")}
        style={styles.avatar}
      />
      <View style={styles.infoSection}>
        <Text style={styles.name}>{name || "No Name"}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.type}>{isPerson ? "Individual" : type === "Client"?"Client":"Firm"}</Text>
          {owner&&<><View style={styles.dot} />
          <Text style={styles.owner}>Owner: {ownerName}</Text></>}
        </View>

        {owner&& <Text style={styles.email}>{ownerEmail}</Text>}
      </View>

      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => onPress(id)}
      >
        {loadingId === id ? (
          <ActivityIndicator />
        ) : (
          <MaterialIcons name="message" size={24} color="#2563EB" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CompanyCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  infoSection: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: "#666",
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: "#999",
    borderRadius: 2,
    marginHorizontal: 6,
  },
  owner: {
    fontSize: 12,
    color: "#444",
  },
  email: {
    fontSize: 12,
    color: "#999",
  },
  messageButton: {
    padding: 8,
  },
});
