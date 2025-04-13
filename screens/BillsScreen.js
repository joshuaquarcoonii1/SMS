import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, ScrollView ,TouchableOpacity} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
const BillsScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [terms, setTerms] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await fetch('https://vraschools.online/ais/api/termLookup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            school_id: student.school_id,
            student_id: student.student_id
          })
        });

        const data = await res.json();
        if (data.status === 'success') {
          setTerms(data.term.term);
          setItems(
            data.term.map((item) => ({
              label: `${item.term} (${item.term_date})`,
              value: item.term_date
            }))
          );
          
        }
      } catch (error) {
        console.error('Error fetching terms:', error);
      }
    };

    fetchTerms();
  }, [student]);

  const fetchBills = async (termDate) => {
    setLoading(true);
    try {
      const res = await fetch('https://vraschools.online/ais/api/billDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: student.student_id,
          term_date: termDate
        })
      });

      const data = await res.json();
      if (data.status === 'success') {
        setBills(data.details || []);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };
  const getTotalBill = () => {
    return bills.reduce((sum, item) => sum + parseFloat(item.bill_amount || 0), 0);
  };
  
  return (
    <SafeAreaView style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
      <Ionicons name="arrow-back" size={24} color="#000" />
      <Text style={styles.backText}>Back</Text>
    </TouchableOpacity>
  
    <Text style={styles.heading}>Select Term</Text>
  
    <View style={{ zIndex: 1000, position: 'relative' }}>
      <View style={styles.dropdownWrapper}>
      <DropDownPicker
        open={open}
        value={selectedTerm}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          const value = callback(selectedTerm);
          setSelectedTerm(value);
          fetchBills(value);
        }}
        setItems={setItems}
        placeholder="Choose a term"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        zIndexInverse={1000}
      />
      </View>
    </View>
  
    {loading && (
      <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 20 }} />
    )}
  
    <ScrollView contentContainerStyle={styles.tableWrapper}>
  <View style={styles.tableHeader}>
    <Text style={[styles.tableCell, styles.headerText]}>ITEM DESCRIPTION</Text>
    <Text style={[styles.tableCell, styles.headerText, { textAlign: 'right' }]}>AMOUNT</Text>
  </View>

  {bills.map((item, index) => (
    <View key={index} style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.payment_for}</Text>
      <Text style={[styles.tableCell, { textAlign: 'right' }]}>GHS {parseFloat(item.bill_amount).toFixed(2)}</Text>
    </View>
  ))}
  {bills.length > 0 && (
  <View style={styles.summarySection}>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Total Bill</Text>
      <Text style={styles.summaryAmount}>GHS {getTotalBill().toFixed(2)}</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Credit from last term</Text>
      <Text style={styles.summaryAmount}>GHS {bills[0].previous_credit?.toFixed(2) || '0.00'}</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Arrears from last term</Text>
      <Text style={styles.summaryAmount}>GHS {bills[0].previous_arrears?.toFixed(2) || '0.00'}</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Adjustments</Text>
      <Text style={styles.summaryAmount}>GHS {bills[0].adjustment?.toFixed(2) || '0.00'}</Text>
    </View>
    <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#ccc', marginTop: 5 }]}>
      <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Amount Due</Text>
      <Text style={[styles.summaryAmount, { fontWeight: 'bold', color: '#d00' }]}>
        GHS {bills[0].amount_due?.toFixed(2) || '0.00'}
      </Text>
    </View>
  </View>
)}


  {!loading && bills.length === 0 && selectedTerm && (
    <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
      No bills found.
    </Text>
  )}
</ScrollView>

  </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
  summarySection: {
  marginTop: 20,
  paddingTop: 10,
},
summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 6,
},
summaryLabel: {
  fontSize: 14,
  color: '#444',
},
summaryAmount: {
  fontSize: 14,
  color: '#444',
},

  tableWrapper: {
  paddingHorizontal: 20,
  paddingBottom: 20
},
tableHeader: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
  paddingVertical: 10,
  marginTop: 10
},
tableRow: {
  flexDirection: 'row',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#f0f0f0',
},
tableCell: {
  flex: 1,
  fontSize: 14,
  color: '#333'
},
headerText: {
  fontWeight: '700'
}
,
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16, marginLeft: 15,
  },
 dropdownWrapper: {
  paddingHorizontal: 20, // Matches FlatList content padding
  zIndex: 1000,
},
dropdown: {
  marginBottom: 20,
},
dropdownContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
},
  list: {
    padding: 20,
    flexGrow: 1
  },  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  billItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  billAmount: {
    marginTop: 4,
    fontSize: 16,
    color: '#4a90e2'
  }
});

export default BillsScreen;