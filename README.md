# SevenCookies 

A premium cookie e-commerce platform featuring seven delicious cookie flavors. This full-stack application provides a seamless online shopping experience with Django backend and modern frontend.

##  Screenshots

| Page | Screenshot |
|------|------------|
| Homepage | ![Homepage](screenshots/homepage.png) |
| Products Page | ![Products Page](screenshots/products-page.png) |
| Shopping Cart | ![Shopping Cart](screenshots/cart.png) |
| Checkout Page | ![Checkout Page](screenshots/checkout-page.png.png) |
| Orders Page | ![Orders Page](screenshots/orders-page.png.png) |
| Order Tracking | ![Order Tracking](screenshots/order-tracking.png.png) |
| Login Page | ![Login Page](screenshots/login-page.png.png) |
## Project Structure

\\\
planetSeven/
├── backend/          # Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── api/          # API endpoints
│   ├── core/         # Core settings
│   └── products/     # Product management
└── frontend/         # React/Vue frontend
    ├── src/          # Source files
    ├── public/       # Static files
    └── package.json  # Dependencies
\\\

## Features

- **Product Catalog**: Browse seven premium cookie flavors
- **User Authentication**: Register, login, profile management
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Track orders, view history
- **Admin Dashboard**: Manage products, orders, users
- **Responsive Design**: Mobile-friendly interface



## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/products/ | GET | List all products |
| /api/products/{id}/ | GET | Get product details |
| /api/cart/ | GET/POST | View/add to cart |
| /api/orders/ | GET/POST | View/create orders |
| /api/auth/register/ | POST | User registration |
| /api/auth/login/ | POST | User login |




## Author

**Maafrica Mokoena**
- Student Number: 20243380
- Sol Plaatje University
- GitHub: @mokoena837

## License

Academic project for Web Development coursework.
