# Ecommerce Frontend

This project is an ecommerce frontend application built with React and TypeScript. It provides a user-friendly interface for browsing products, managing a shopping cart, and completing purchases.

## Features

- **Product Listing**: Displays a list of products with details such as images, titles, and prices.
- **Product Details**: View detailed information about a specific product.
- **Shopping Cart**: Manage items in the cart, view total prices, and proceed to checkout.
- **User Profile**: View and manage user information and order history.
- **Responsive Design**: The application is designed to be responsive and works well on various screen sizes.

## Project Structure

```
ecommerce-frontend
├── public
│   └── favicon.ico
├── src
│   ├── components
│   │   ├── common
│   │   │   └── Navbar.tsx
│   │   ├── product
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductList.tsx
│   │   ├── cart
│   │   │   └── CartSidebar.tsx
│   │   └── footer
│   │       └── Footer.tsx
│   ├── pages
│   │   ├── index.tsx
│   │   ├── product
│   │   │   └── [id].tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   └── profile.tsx
│   ├── styles
│   │   └── globals.css
│   ├── utils
│   │   └── api.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd ecommerce-frontend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

Open your browser and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.