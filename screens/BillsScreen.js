import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, Button } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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
              label: item.term,
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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bills}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <Button title="Back" onPress={handleBack} />
            <Text style={styles.heading}>Select Term</Text>
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
            />
            {loading && <ActivityIndicator size="large" color="#4a90e2" style={{ marginTop: 20 }} />}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.billItem}>
            <Text style={styles.billTitle}>{item.payment_for}</Text>
            <Text style={styles.billAmount}>GHS {item.bill_amount}</Text>
          </View>
        )}
        // ListEmptyComponent={!loading && <Text>No bills found</Text>}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16
  },
  dropdown: {
    marginBottom: 20
  },
  dropdownContainer: {
    zIndex: 1000
  },
  list: {
    padding: 20,
    flexGrow: 1
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