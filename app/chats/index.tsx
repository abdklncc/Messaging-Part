import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

interface Chat {
  id: string;
  lastMessage: string;
  timestamp: Date;
  expiresAt: number;
  participants: string[];
  userAvatar: string;
  userName: string;
}

export default function Chats() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate(),
        expiresAt: doc.data().timestamp?.toDate().getTime() + (24 * 60 * 60 * 1000)
      })) as Chat[];
      
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  const createNewChat = () => {
    router.push('/chats/new/page');
  };

  const deleteChat = async (chatId: string) => {
    try {
      await deleteDoc(doc(db, "chats", chatId));
      Alert.alert("Başarılı", "Sohbet silindi.");
    } catch (error) {
      console.error("Error deleting chat:", error);
      Alert.alert("Hata", "Sohbet silinirken bir hata oluştu.");
    }
  };

  const renderRightActions = (chatId: string) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteChat(chatId)}>
      <FontAwesome name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  const goToHome = () => {
    router.back();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={goToHome}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Sohbetler</Text>

        <FlatList
          horizontal
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.storyContainer}>
              <Image
                source={{ uri: item.userAvatar }}
                style={styles.storyAvatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.storiesList}
        />
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.id)}>
            <Link href={`/chats/${item.id}/page`} asChild>
              <TouchableOpacity style={styles.chatItem}>
                <Image
                  source={{ uri: item.userAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.chatInfo}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.lastMessage}>{item.lastMessage}</Text>
                </View>
                <Text style={styles.timestamp}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            </Link>
          </Swipeable>
        )}
      />

      {/* New Chat Button */}
      <TouchableOpacity 
        style={styles.newChatButton} 
        onPress={createNewChat}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 10,
  },
  storiesList: {
    marginTop: 10,
  },
  storiesContainer: {
    paddingBottom: 15,
  },
  storyContainer: {
    marginRight: 15,
    alignItems: 'center',
    width: 70,
  },
  storyWrapper: {
    position: 'relative',
    padding: 2,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  timeLeft: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontSize: 10,
    padding: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  timeLeftSmall: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#3b82f6',
    color: '#fff',
    fontSize: 8,
    padding: 2,
    borderRadius: 8,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  messageInfo: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  messageOptions: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
  },
  newChatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
  },
}); 