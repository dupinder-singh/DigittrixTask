import React from 'react'
import { User } from '../dataModel/userResponse'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from '@expo/vector-icons/FontAwesome';
import { useFavorites } from '../context/FavContext';
const UserItemCard = ({ item, style }: { item: User, style?: any }) => {
  const {toggleFavorite, isFavorite} = useFavorites();
  const fav = isFavorite(item.id);
  return (
    <View style={[styles.card, style]}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
      <TouchableOpacity onPress={()=>toggleFavorite(item)}>
        <Icon name={fav ? 'star' : 'star-o'} size={24} color="orange" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default UserItemCard
