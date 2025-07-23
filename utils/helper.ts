import * as WebBrowser from "expo-web-browser";
import { Platform, Share } from "react-native";
 export const isIosDevice= Platform.OS==="ios"

 export const handleOpenDocument = async (doc: any) => {
    WebBrowser.openBrowserAsync(doc.url);
  };

  export const shareDocument = async (doc: any) =>{
    try {
      const shareOptions = {
        title: "Share Document",
        message: "Share this document with others",
        url: doc.url,
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error("Error sharing document:", error);
    }
  }