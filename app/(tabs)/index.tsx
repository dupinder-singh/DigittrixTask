import { ActivityIndicator, Alert, FlatList, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchUsers } from "../../src/api/userApi";
import React, { useEffect, useState } from 'react'
import { User } from "../../src/dataModel/userResponse";
import UserItemCard from "../../src/components/UserItemCard";
import { isNetworkAvailable } from "@/src/api/checkNetwork";

const index = () => {
  const insets = useSafeAreaInsets();


  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);


  const loadUsers = async (page: number, isRefresh: boolean = false) => {
    try {
      if (page > totalPages) return;
      
      const isInternetAvailable = await isNetworkAvailable();
      if (!isInternetAvailable){
        Alert.alert('No Internet connection');
        if(isRefresh) setIsRefreshing(false);
        return;
      }
      

      setLoading(true);
      const data = await fetchUsers(page);
      
      if(isRefresh){
        resetDataIfRefreshed();
      }
      const newUsers = data.data;
      setUsers(prevUsers => [...prevUsers, ...newUsers]);

      // Update filteredUsers based on searchText
      const searchLowerCase = searchText.trim().toLowerCase();
      const filtered = searchLowerCase ?
      newUsers.filter(user =>
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLowerCase)
      ) : newUsers;
      setFilteredUsers(prevUsers => [...prevUsers, ...filtered]);

      setTotalPages(data.total_pages);
      setPages(page + 1)
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadUsers(1)
  },[])

  // Update filteredUsers whenever users or searchText changes
 
  useEffect(() => {
    const searchLowerCase = searchText.trim().toLowerCase();
    const filtered = searchLowerCase ?
    users.filter(user =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLowerCase)
    ) : users;
    setFilteredUsers(filtered);
  }, [searchText])

  const handlePagination = () => {
    if (!loading && !isEndReached && pages <= totalPages && users.length > 0) {
      setIsEndReached(true);
      loadUsers(pages).then(() => setIsEndReached(false));
    }
  }

  // Reset data if the user refreshes the list
  const resetDataIfRefreshed = ()=>{
    setFilteredUsers([]);
    setUsers([]);
    setPages(1);
    setTotalPages(1);
    setSearchText('');
  }

  const handnleRefresh = () => {
    setIsRefreshing(true);

    loadUsers(1,true).then(() => setIsRefreshing(false));
  }

  // Function to group users into rows of 1 or 2 items
  const userGrouping = (users: User[]): User[][] => {
    const result: User[][] = [];
    let i = 0;

    while (i < users.length) {
      if (result.length % 2 === 0) {
        // Odd row → single item
        result.push([users[i]]);
        i += 1;
      } else {
        // Even row → two items (if available)
        result.push(users.slice(i, i + 2));
        i += 2;
      }
    }

    return result;
  };

  const renderItems = ({ item }: { item: User[] }) => {
    return (
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        {item.map((user, index) => (
          <UserItemCard
            key={user.id}
            item={user}
            style={{
              flex: item.length === 1 ? 1 : 0.5,
            }}
          />
        ))}
      </View>
    )
  }
  return (
    <View style={{flex:1,paddingTop:insets.top}}>
      <TextInput
        placeholder="Search by name..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 8,
          margin: 4,
          marginTop:10
        }}/>

   

      {loading && users.length === 0 ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) :
        <FlatList
          data={userGrouping(filteredUsers)}
          renderItem={renderItems}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={handlePagination}
          onEndReachedThreshold={0.1}
          refreshing={isRefreshing}
          onRefresh={handnleRefresh}
          ListEmptyComponent={
            <View style={{ alignItems: 'center' }}>
              <Text>No users found</Text>
            </View>
          }
          contentContainerStyle={{  flexGrow: 1,
            justifyContent: filteredUsers.length === 0 ? 'center' : 'flex-start', }}
         
        />
      }

    </View>
  )
}

export default index

