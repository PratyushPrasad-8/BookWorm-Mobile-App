# 📚 Bookworm App
<img src="https://cdn.edu.buncee.com/assets/abbde3e5bc174eb59c55d4b2f278ec48/animation-library-magicbookp-022120.gif?timestamp=1582320629" height=400>


Welcome to **Bookworm** – a full-stack book review app where users can explore books, post reviews, and read what others have shared to make informed reading choices. Built completely from scratch with no external service integration, this app delivers a seamless and responsive experience powered by MERN stack and React Native.

---

## 🚀 Features

- 📖 **Browse Books** – Explore books and read reviews from other users  
- 📝 **Review System** – Add your own reviews to share your thoughts  
- 🔐 **Authentication** – Secure user login & signup using JWT tokenization  
- 🎨 **Responsive UI** – Clean and modern UI built with FlatLists and Expo Image Library  
- 🌙 **Theme Support** – Toggle between light and dark themes  
- 🧠 **State Management** – Efficient handling with Zustand  
- 💾 **Async Storage** – Seamless user data persistence on the client  
- 🕒 **CRON Jobs** – Keeps server alive and ready to handle user requests  
- ☁️ **Cloudinary Integration** – Store and manage images efficiently
- 💾 **Paging** – Paging for reducing data loading  
- ⚙️ **Custom Middleware** – Handle authentication, error management, and more  

---

## 🧑‍💻 Tech Stack

### Frontend
- React Native (Expo)
- Zustand (state management)
- AsyncStorage
- Expo Libraries (e.g., image-picker, navigation)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- Cloudinary (image uploads)
- JWT (Authentication & Tokenization)
- Custom Middlewares
- CRON Jobs for server uptime

---

## 📂 Folder Structure

```
Bookworm/
├── client/                # React Native App
│   ├── components/
│   ├── screens/
│   ├── store/             # Zustand Store
│   └── ...
├── server/                # Express Backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middlewares/
│   └── ...
├── .env
├── package.json
└── README.md
```

---

## 🛠️ Setup & Installation

### Prerequisites:
- Node.js
- MongoDB Atlas or Local MongoDB
- Expo Go App (for mobile testing)
- Cloudinary account (for image hosting)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bookworm.git
cd bookworm
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Setup `.env` File

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start Backend Server

```bash
npm start
```

### 5. Install Client Dependencies

```bash
cd ../client
npm install
```

### 6. Run the React Native App

```bash
npx expo start
```

---

## 📸 Screenshots

<img src="https://github.com/user-attachments/assets/985a194f-62ed-4234-ac2f-8ba3855ca648" height=400>
<img src="https://github.com/user-attachments/assets/3cf702c4-d5d3-42a6-8fa3-661f4bee31d6" height=400>
<img src="https://github.com/user-attachments/assets/587f85c0-6833-437f-9c38-f15f753fa96b" height=400>



---

## 📅 Future Scope

- 📌 Book Categories & Filters  
- 🧑 User Profiles & Followers  
- 🔔 Notifications  
- 💬 Comment system on reviews  
- 🔍 Advanced Search Features  

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change or improve.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

Made with 💙 by Pratyush  
🔗 [LinkedIn](https://www.linkedin.com/in/yourusername) | [GitHub](https://github.com/yourusername) | [Twitter](https://twitter.com/yourusername)

---

> *“A reader lives a thousand lives before he dies.” – George R.R. Martin*
