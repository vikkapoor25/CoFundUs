import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Card from "./Card";
import colours from "../constants/colours";

export default function AccountCards({
  title = "Household Accounts",
  accounts = [],
  emptyText = "You don’t have any accounts set up yet. Add an account to start tracking your balance.",
  renderAccount,
  addIncome,
  deleteAccount
}) {
  return (
    <Card title={title}>
      {accounts.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        <View style={styles.list}>
          {accounts.map((account, index) =>
            renderAccount ? (
              renderAccount(account, index)
            ) : (
              <View key={account.account_id} style={styles.card}>
                
                
                {/* left (name and type) */}
                <View style={styles.left}>
                  <Text style={styles.name}>{account.account_name}</Text>
                  <Text style={styles.type}>{account.account_type}</Text>
                </View>

                {/* right (income, net gain or loss) */}
                <View style={styles.right}>
                  <Text style={styles.balance}>
                    £{Number(account.account_balance ?? 0)}
                  </Text>
                  <Text
                    style={[
                      styles.net,
                      account.net_gain_loss >= 0
                        ? styles.positive
                        : styles.negative,
                    ]}
                  >
                    {account.net_gain_loss >= 0 ? "+" : ""}
                    £{Number(account.net_gain_loss ?? 0)}
                  </Text>
                </View>

                {/* bottom (income bills and goals) */}
                <View style={styles.statsRow}>
                  <Text style={styles.stat}>
                    Income: £{Number(account.income_total ?? 0)}
                  </Text>

                  <Text style={styles.stat}>
                    Bills: £{Number(account.bills_total ?? 0)}
                  </Text>

                  {account.allocated_to_goal != null && (
                    <Text style={styles.stat}>
                      Goal: £{Number(account.allocated_to_goal)}
                    </Text>
                  )}
                </View>

                <View style={styles.actionsRow}>
                  <Pressable
                    onPress={() => addIncome?.(account.account_id)}
                    style={[styles.smallButton, styles.incomeButton]}
                  >
                    <Text style={styles.smallButtonText}>Add Income</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => deleteAccount?.(account.account_id)}
                    style={[styles.smallButton, styles.deleteButton]}
                  >
                    <Text style={styles.smallButtonText}>Delete</Text>
                  </Pressable>
                </View>

              </View>
            )
          )}
        </View>
      )}
    </Card>
  );
}
const styles = StyleSheet.create({
  list: {
    marginTop: 20,
    gap: 15,
  },
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: colours.accountCards,
  },
  left: {
    marginBottom: 8,
  },
  right: {
    position: "absolute",
    right: 12,
    top: 12,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "white",
  },
  type: {
    fontSize: 12,
    color: "#f3f3f3",
    marginTop: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  net: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },

  positive: {
    color: colours.softGreen,
  },

  negative: {
    color: colours.softRed,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f3f3f3",
  },
  stat: {
    fontSize: 11,
    color: "white",
    fontWeight: "20",
  },
  emptyText: {
    paddingVertical: 12,
    color: colours.label,
    fontSize: 13,
    fontStyle: "italic",
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: "row",
  },
  smallButton: {
  flex: 1,
  paddingVertical: 8,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.3)",
  alignItems: "center",
},

deleteButton: {
  marginLeft: 8,
  borderColor: colours.softRed,
},
incomeButton:  {
  borderColor: "white",
},
smallButtonText: {
  color: "white",
  fontSize: 12,
  fontWeight: "600",
},
});