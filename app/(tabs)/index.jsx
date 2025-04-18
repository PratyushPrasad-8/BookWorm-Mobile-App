import { View, Text, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles.js/home.styles";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../../constants/colors";
import { formatPublishDate } from "../../lib/utils";
import Loader from "../../components/Loader.jsx";

export default function Home() {
  const { token } = useAuthStore();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum == 1) setLoading(true);

      const response = await fetch(
        `https://bookworm-6hcc.onrender.com/api/books?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "failed to Fetch books");

      //setBooks((prevBooks) => [...prevBooks, ...data.books]);

      const uniqueBooks =
        refresh || pageNum === 1
          ? data.books
          : Array.from(
              new Set([...books, ...data.books].map((book) => book._id))
            ).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            );

      setBooks(uniqueBooks);

      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.log("Error fetching books", error);
    } finally {
      if (refresh) {
        await sleep(100);
        setRefreshing(false);
      }
      else setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) fetchBooks(page + 1);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.bookCard}>
        {/*Book Header*/}
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.avatar}
            />

            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>

        {/*Image*/}
        <View style={styles.bookImageContainer}>
          <Image
            source={item.image}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>

        {/*Book Details*/}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.date}>
            Shared on {formatPublishDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
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

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }

        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from your community
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="book-outline"
              size={60}
              color={COLORS.textSecondary}
            />
            <Text style={styles.emptyText}>No recommendations Yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share your thoughts
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : (
            <Text style={styles.emptySubtext}>Stay tuned for more updates</Text>
          )
        }
      />
    </View>
  );
}
