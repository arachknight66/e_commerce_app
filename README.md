# Mobile E-Commerce MVP 📱

A high-performance, polished mobile e-commerce application built using **React Native (Expo)** and a **Node.js / Express / MongoDB** backend. This project serves as a fully functional Minimum Viable Product (MVP) designed for seamless shopping, secure local storage, and robust state management using the React Context API.

---

## 🌟 Key Features

### Frontend (Mobile App)
- **Restful Authentication**: Complete splash screen flow, JWT-based user login, account registration, and local session caching via `AsyncStorage`.
- **Dynamic Home Screen**: Branded carousel banner for featured products, horizontal categories filter, and a comprehensive product showcase grid.
- **Product Details**: Image carousels, category/out-of-stock badges, price calculations, and stock-aware quantity selectors.
- **Interactive Cart**: Seamless quantity increments/decrements, item removals, and real-time subtotal/total summaries.
- **Cash on Delivery (COD) Checkout**: Simplified, error-free checkout process focusing on shipping information and direct order placement.
- **Profile & Address Manager**: Automatically generated initials-based user avatar, profile editing (name, street, city, zip, country), and secure logout.
- **Real-Time Order History**: Comprehensive overview of previous orders complete with IDs, formatted dates, status indicators (Pending, Shipped, etc.), order items preview, and pull-to-refresh.

### Backend (REST API)
- **Auth Endpoint**: JWT token validation, user registration, profiles, and password hashing using `bcryptjs`.
- **Product Management**: Query filters for text search, categories, and custom fetch limits.
- **Cart & Orders**: CRUD APIs for managing user-specific carts and tracking orders.
- **Local Static Asset Hosting**: Express middleware configured to serve local product images dynamically.

---

## 🛠️ Technology Stack

- **Frontend**: React Native, Expo (SDK 54), React Navigation, Axios, NativeWind (Tailwind CSS), AsyncStorage, Context API.
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), JSON Web Tokens (JWT).

---

## 🚀 Local Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version >= 18).

---

### 1. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` root directory and add the following:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://dakshsaini889_db_user:eZMGaGhTZsJFtOek@ecommerceapp.2rmsk6y.mongodb.net/?appName=Ecommerceapp
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRES_IN=7d
   API_URL=http://<YOUR_LOCAL_IP>:5000
   ```
   *(Replace `<YOUR_LOCAL_IP>` with your machine's local IPv4 network address, e.g., `192.168.1.63`)*
4. Run the seed script to populate products inside the MongoDB Atlas cloud database:
   ```bash
   node src/seed/productSeed.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies (utilizes legacy peer deps configuration to align with SDK 54):
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` root directory and add:
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api
   ```
   *(Ensure the IP matches the backend `API_URL` configuration)*
4. Start the Expo development server:
   ```bash
   npx expo start -c
   ```
5. Scan the generated QR code using the **Expo Go** application (Android) or your camera app (iOS) to run the application on your physical device.

---

## 🖼️ Product Images Guide

The application supports hosting product images locally on the backend server.
1. Place all your product image files inside:
   📁 `backend/public/images/products/`
2. Name the images according to the products in the seed file (e.g., `iphone15.jpg`, `nike_shoes.jpg`, `yoga_mat.jpg`). 
3. *Note: If an image is missing, the frontend automatically displays a clean, responsive placeholder.*

---

## 📡 Live Presentation Tunnelling (Ngrok / Localtunnel)

To present this application remotely or run it on a phone not on your local Wi-Fi subnet, you can expose the backend to the internet using **localtunnel**:

1. Install localtunnel globally:
   ```bash
   npm install -g localtunnel
   ```
2. Create a tunnel for port `5000`:
   ```bash
   lt --port 5000
   ```
3. Update your `.env` configs with the public tunnel URL:
   - **Backend `.env`**: Set `API_URL=https://<your-subdomain>.loca.lt`
   - **Frontend `.env`**: Set `EXPO_PUBLIC_API_URL=https://<your-subdomain>.loca.lt/api`
4. Re-run the backend seed script to update database image URLs:
   ```bash
   node src/seed/productSeed.js
   ```
5. Start the Expo server and share the Expo Go QR code with the reviewer.