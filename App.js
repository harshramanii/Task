import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  LogBox,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [historyList, setHistoryList] = useState([]);

  const onPressAddData = () => {
    axios
      .get('http://www.boredapi.com/api/activity/')
      .then(res => {
        setFilteredDataSource([...filteredDataSource, res.data]);
        setMasterDataSource([...masterDataSource, res.data]);
      })
      .catch(e => {
        console.log('e');
      });
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs(); //Ignore all log notifications
    getHistoryByLocal();
  }, []);

  const getHistoryByLocal = async () => {
    const data = await AsyncStorage.getItem('historyList');
    if (data === null) {
      setHistoryList([]);
    } else {
      setHistoryList(JSON.parse(data));
    }
  };

  const onChangeText = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.activity
          ? item.activity.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const onPressItem = (item, index) => {
    setHistoryList([...historyList, item]);
    AsyncStorage.setItem('historyList', JSON.stringify([...historyList, item]));
  };

  return (
    <SafeAreaView style={style.container}>
      <TextInput
        value={search}
        placeholder="Search here ....."
        style={style.inputStyle}
        onChangeText={onChangeText}
      />
      <ScrollView>
        <FlatList
          contentContainerStyle={{marginHorizontal: 10}}
          ListHeaderComponent={() => (
            <Text style={style.labelTextStyle}>{'History'}</Text>
          )}
          ItemSeparatorComponent={() => {
            return <View style={{borderWidth: 0.8}} />;
          }}
          data={historyList}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity style={style.historyItemStyle}>
                <Text>{item.activity}</Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => {
            if (historyList.length === 0) {
              return (
                <Text style={style.noDataFoundTextStyle}>
                  {'No History found'}
                </Text>
              );
            } else {
              return null;
            }
          }}
        />

        <FlatList
          contentContainerStyle={{marginHorizontal: 10, marginTop: 20}}
          ListHeaderComponent={() => (
            <Text style={style.labelTextStyle}>{'List'}</Text>
          )}
          ItemSeparatorComponent={() => {
            return <View style={{borderWidth: 0.8}} />;
          }}
          data={filteredDataSource}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => onPressItem(item, index)}
                style={style.historyItemStyle}>
                <Text>{item.activity}</Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => {
            if (filteredDataSource.length === 0) {
              return (
                <Text style={style.noDataFoundTextStyle}>
                  {'No List found'}
                </Text>
              );
            } else {
              return null;
            }
          }}
        />
      </ScrollView>

      <TouchableOpacity
        onPress={onPressAddData}
        style={style.floatingButtonStyle}>
        <Text style={style.addTextStyle}>{'Add'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    margin: 10,
    color: 'black',
    fontSize: 16,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  historyItemStyle: {
    padding: 10,
  },
  floatingButtonStyle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 50,
  },
  addTextStyle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelTextStyle: {
    color: 'black',
    fontWeight: 'bold',
  },
  noDataFoundTextStyle: {
    textAlign: 'center',
    padding: 20,
    color: 'gery',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default App;
