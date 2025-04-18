import {
  View,
  Text,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";
import styles from "../../assets/styles.js/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { RefreshControl } from "react-native";

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [deletedBookId, setDeletedBookId] = useState(null);

  const { token } = useAuthStore();

  const router = useRouter();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://bookworm-6hcc.onrender.com/api/books/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "failed to Fetch books");

      setBooks(data.books);
    } catch (error) {
      console.log("error fetching books", error);
      Alert.alert(
        "Error",
        "Failed to load down the data. Pull down to refresh"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = (bookId) => {
    Alert.alert(
      "Delete Recommendation",
      "Are you sure you want to delete this Recommendation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            handleDeleteBook(bookId);
          },
        },
      ]
    );
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setDeletedBookId(bookId);
      const response = await fetch(
        `https://bookworm-6hcc.onrender.com/api/books/${bookId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log(data);
      if (!response.ok)
        throw new Error(data.message || "failed to delete book");

      setBooks(books.filter((book) => book._id !== bookId));
      Alert.alert("Success", "Recommendation deleted successfully");
    } catch (error) {
      console.log("error deleting book", error);
      Alert.alert("Error", "Failed to delete book");
    } finally {
      setDeletedBookId(null);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const renderBookItem = ({ item }) => {
    return (
      <View style={styles.bookItem}>
        <Image source={item.image} style={styles.bookImage} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item._id)}
        >
          {deletedBookId === item._id ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/*Book Recommendations*/}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      {/*Scroll*/}
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={50}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No Recommendations Found</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Text style={styles.addButtonText}>Add Your First Book</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
