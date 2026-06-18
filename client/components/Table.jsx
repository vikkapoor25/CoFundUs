import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

export default function TableCard({
  title,
  headers = [],
  data = [],
  emptyText = "No data available",
  renderRow,
}) {
  return (
    <Card title={title}>
      
      {/* table headers */}
      <View style={styles.tableHeader}>
        {headers.map((h, index) => (
          <Text key={index} style={styles.colHeader}>
            {h}
          </Text>
        ))}
      </View>

      {/* if empty */}
      {data.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        data.map((item, index) => renderRow(item, index))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  colHeader: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#55626d',
  },
  emptyText: {
    paddingVertical: 12,
    color: '#7a8794',
    fontSize: 13,
    fontStyle: 'italic',
  },
});