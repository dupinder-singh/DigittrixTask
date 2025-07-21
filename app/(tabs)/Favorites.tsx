import React, { useEffect, useState } from 'react'
import { FlatList, Platform, StatusBar, Text, TextInput, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { User } from '../../src/dataModel/userResponse'
import { useFavorites } from '../../src/context/FavContext'
import UserItemCard from '../../src/components/UserItemCard'
const Favorites = () => {
    const insets = useSafeAreaInsets();
    const { favorites } = useFavorites();
    const [filteredFavorites, setFilteredFavorites] = useState<User[]>(favorites);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        searchDataForUserList(favorites);
    }, [searchText, favorites])

    // Function to filter users based on search text
    const searchDataForUserList = (usersList: User[]) => {
        const searchLowerCase = searchText.trim().toLowerCase();
        const filtered = searchLowerCase ?
            usersList.filter(user =>
                `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLowerCase)
            ) : usersList;
        setFilteredFavorites(filtered);
    }

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
                {item.map((user) => (
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
        <View style={{ paddingTop: insets.top }}>
            <TextInput
                placeholder="Search by name..."
                value={searchText}
                onChangeText={setSearchText}
                style={{
                    backgroundColor: 'white',
                    padding: 10,
                    borderRadius: 8,
                    margin: 4,
                    marginTop: 10
                }}
            />

            <FlatList
                data={userGrouping(filteredFavorites)}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItems}
                ListEmptyComponent={
                    <View style={{ alignItems: 'center' }}>
                        <Text>No users found</Text>
                    </View>
                }
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: filteredFavorites.length === 0 ? 'center' : 'flex-start',
                }}
            />


        </View>
    )
}

export default Favorites
