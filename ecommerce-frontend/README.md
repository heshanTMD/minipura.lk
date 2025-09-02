# Ecommerce Frontend

A modern ecommerce frontend built with **React** and **TypeScript**.  
This app lets users browse products, view details, manage their cart, and complete purchases with a clean, responsive UI.

## ✨ Features

- **Product Listing**: Browse all products with images, titles, and prices.
- **Product Details**: View detailed info for each product.
- **Shopping Cart**: Add, remove, and update items in your cart.
- **Checkout**: Simple checkout flow.
- **User Profile**: Manage your profile and view order history.
- **Responsive Design**: Works great on desktop and mobile.

## 📁 Project Structure

```
ecommerce-frontend
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── Navbar.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   ├── cart/
│   │   │   └── CartSidebar.tsx
│   │   └── footer/
│   │       └── Footer.tsx
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── product/
│   │   │   └── [id].tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   └── profile.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── utils/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   ```

2. **Navigate to the project directory**
   ```sh
   cd ecommerce-frontend
   ```

3. **Install dependencies**
   ```sh
   npm install
   # or
   pnpm install
   ```

4. **Start the development server**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests for improvements and bug fixes.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.