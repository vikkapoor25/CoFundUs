import React from "react";
import { WebView } from "react-native-webview";

export default function MetabaseScreen() {
  return (
    <WebView
      source={{
        uri: "https://vivid-abaft.metabaseapp.com/public/dashboard/0182bc8c-096c-4b7c-beb3-8382e65315c1"
      }}
      style={{ flex: 1 }}
    />
  );
}