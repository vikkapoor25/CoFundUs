import React from "react";
import { WebView } from "react-native-webview";

export default function MetabaseScreen({url}) {
  return (
    <WebView
      source={{
        uri: url
      }}
      style={{ flex: 1 }}
    />
  );
}