import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import styles from "../../assets/styles.js/create.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useAuthStore } from "../../store/authStore";
import { use } from "react";

export default function Create() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null); //To display the selected image
  const [imagebase64, setImagebase64] = useState(null); //To convert the selected image to text (base64) and send it over internet easily
  const [loading, setLoading] = useState(false);

  const { user, token } = useAuthStore();
  const router = useRouter();

  const pickImage = async () => {
    try {
      //request permission from user
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "we need camera roll permissions to upload an image"
          );
          return;
        }
      }

      //Launch Image Library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, //lower quality for smaller base 64 representation
        base64: true,
      });

      //Stting image and converting it to base 64
      if (!result.canceled) {
        setImage(result.assets[0].uri); //To display the selected image

        if (result.assets[0].base64) {
          setImagebase64(result.assets[0].base64);
        } else {
          //convert to base 64 explicitly
          const base64 = await FileSystem.readAsStringAsync(
            result.assets[0].uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );
          setImagebase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking image", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleSubmit = async () => {
    //Check for validations
    if (!title || !caption || !imagebase64 || !rating) {
      Alert.alert("Error", "Please fill in all the fields");
      return;
    }

    try {
      setLoading(true);

      //Get file extension from uri or default to Jpeg
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType
        ? `image/${fileType.toLowerCase()}`
        : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imagebase64}`; //converting to base64 string format
      //example of base64 url string: [-->data:image/jpeg;base64,<--] /9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHxwc

      //Uploading book recommendation
      const response= await fetch("https://bookworm-6hcc.onrender.com/api/books/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, caption, image: imageDataUrl, rating:rating.toString() }),
      });

      const data= await response.json();
      if(!response.ok) throw new Error(data.message || "something went wrong <");

      Alert.alert("Success", "Book Recommendation uploaded successfully");

      //Reseting our states
      setTitle("");
      setCaption("");
      setImage(null);
      setImagebase64(null);
      setRating(3);

      router.replace("/(tabs)");
    } catch (error) {
      console.log("Error uploading book recommendation", error);
      Alert.alert("Error", "There was a problem uploading your book recommendation");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={32}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
            key={i}
            onPress={() => setRating(i)}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          {/*Header*/}
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>

          <View style={styles.form}>
            {/*Book Title*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter book title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            {/*Rating*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderRatingPicker()}
            </View>

            {/*Image*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline"
                      size={40}
                      color={COLORS.textSecondary}
                    />
                    <Text style={styles.placeholderText}>
                      Tap to Select Image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/*caption*/}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write your review or thoughts about this book..."
                placeholderTextColor={COLORS.placeholderText}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/*Submit Button*/}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
