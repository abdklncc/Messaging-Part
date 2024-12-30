import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';

const FAKE_USERS = [
  { name: 'Ahmet Yılmaz', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Ayşe Demir', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Mehmet Kaya', avatar: 'https://i.pravatar.cc/150?img=3' },
  { name: 'Zeynep Çelik', avatar: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Can Yıldız', avatar: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Elif Öztürk', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Burak Şahin', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Deniz Aydın', avatar: 'https://i.pravatar.cc/150?img=15' },
];

export default function NewChat() {
  const startNewChat = async (user: typeof FAKE_USERS[0]) => {
    try {
      // Önce bu kullanıcıyla mevcut bir sohbet var mı kontrol et
      const chatsRef = collection(db, "chats");
      const q = query(
        chatsRef,
        where("userName", "==", user.name)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Eğer mevcut bir sohbet varsa, o sohbete yönlendir
      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        router.push(`/chats/${existingChat.id}/page`);
        return;
      }

      // Mevcut sohbet yoksa yeni sohbet oluştur
      const docRef = await addDoc(collection(db, "chats"), {
        userName: user.name,
        userAvatar: user.avatar,
        lastMessage: "Merhaba! Nasılsın?",
        timestamp: serverTimestamp(),
        participants: ['currentUser', 'otherUser'],
      });

      await addDoc(collection(db, `chats/${docRef.id}/messages`), {
        content: "Merhaba! Nasılsın?",
        type: 'text',
        timestamp: serverTimestamp(),
        senderId: 'otherUser'
      });

      router.push(`/chats/${docRef.id}/page`);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Yeni Sohbet</Text>
      </View>

      <FlatList
        data={FAKE_USERS}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userItem}
            onPress={() => startNewChat(item)}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingTop: 50,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '500',
  },
}); 