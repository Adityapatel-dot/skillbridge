<div align="center">

# 🌉 SkillBridge

### Zero-Commission Dual-Sided Service Marketplace

[![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> A full-stack marketplace platform connecting clients with skilled service providers — **zero commission, full transparency.**

[🚀 Live Demo](#) &nbsp;·&nbsp; [📖 Docs](#) &nbsp;·&nbsp; [🐛 Report Bug](https://github.com/Adityapatel-dot/skillbridge/issues) &nbsp;·&nbsp; [💡 Request Feature](https://github.com/Adityapatel-dot/skillbridge/issues)

</div>

---

## 📌 About The Project

**SkillBridge** is a production-grade, dual-sided marketplace that eliminates the commission gap between clients and service providers. Built as a full-stack MCA final year project, it showcases real-world software engineering practices including JWT-based authentication, real-time WebSocket communication, and geo-based discovery.

### 🎯 Problem It Solves
Traditional freelance platforms charge **15–30% commission**, eating into provider earnings. SkillBridge offers a direct booking model with **0% platform commission**.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Secure Auth** | JWT-based authentication with Spring Security & Role-Based Access Control (RBAC) |
| 💬 **Real-Time Chat** | WebSocket (STOMP protocol) live messaging between clients and providers |
| 🗺️ **Map Discovery** | Leaflet.js geo-based provider discovery with dynamic map markers |
| 🌍 **Multi-Language** | i18n support for regional language accessibility |
| 🌙 **Dark / Light Mode** | Dynamic theming across the entire app |
| 📋 **Booking System** | End-to-end service booking with status tracking |
| ⭐ **Reviews & Ratings** | Post-service feedback system |
| 👥 **Dual Roles** | Separate Client and Provider dashboards |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 17+** | Core language |
| **Spring Boot 3.5** | REST API framework |
| **Spring Security** | Authentication & authorization |
| **Spring Data JPA** | ORM & database layer |
| **WebSocket (STOMP)** | Real-time communication |
| **JWT** | Stateless token-based auth |
| **Maven** | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework (SPA) |
| **JavaScript (ES6+)** | Core language |
| **Leaflet.js** | Interactive maps |
| **Bootstrap 5** | Responsive UI components |
| **WebSocket Client** | Real-time push updates |

### Database & Tools
| Technology | Purpose |
|---|---|
| **MySQL 8.0** | Relational database |
| **Git & GitHub** | Version control |
| **Postman** | API testing |
| **Figma** | UI/UX design |
| **VS Code** | IDE |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React 19 Frontend                  │
│         (SPA · Leaflet Maps · WebSocket Client)      │
└──────────────────────┬──────────────────────────────┘
                       │ REST API + WebSocket (STOMP)
┌──────────────────────▼──────────────────────────────┐
│              Spring Boot 3.5 Backend                 │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │ Spring        │  │ REST         │  │WebSocket │  │
│  │ Security+JWT  │  │ Controllers  │  │ Handler  │  │
│  └───────────────┘  └──────────────┘  └──────────┘  │
│  ┌────────────────────────────────────────────────┐  │
│  │           Spring Data JPA (ORM Layer)          │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                   MySQL 8.0                          │
│   Users · Services · Bookings · Messages · Reviews   │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
skillbridge/
├── backend/                    # Spring Boot application
│   ├── src/main/java/
│   │   └── com/skillbridge/
│   │       ├── config/         # Security, WebSocket config
│   │       ├── controller/     # REST API endpoints
│   │       ├── model/          # JPA entities
│   │       ├── repository/     # Spring Data repositories
│   │       ├── service/        # Business logic
│   │       └── security/       # JWT filter & auth
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React 19 application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level pages
│   │   ├── context/            # Global state (auth, theme)
│   │   ├── hooks/              # Custom React hooks
│   │   └── services/           # API + WebSocket clients
│   └── public/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0
- Maven 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/Adityapatel-dot/skillbridge.git
cd skillbridge
```

### 2. Configure the Database
```sql
CREATE DATABASE skillbridge_db;
```

Update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillbridge_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key
```

### 3. Run the Backend
```bash
cd backend
mvn spring-boot:run
```
> Backend will start at `http://localhost:8080`

### 4. Run the Frontend
```bash
cd frontend
npm install
npm start
```
> Frontend will start at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login & get JWT | Public |
| `GET` | `/api/services` | Browse all services | Public |
| `POST` | `/api/services` | Create service listing | Provider |
| `POST` | `/api/bookings` | Book a service | Client |
| `GET` | `/api/bookings/my` | My bookings | Auth |
| `GET` | `/api/providers/nearby` | Map-based discovery | Public |
| `WS` | `/ws/chat/{roomId}` | Real-time chat | Auth |

---

## 👨‍💻 Author

**Aditya Patel**
- 🔗 LinkedIn: [linkedin.com/in/aditya-patel-74253928b](https://linkedin.com/in/aditya-patel-74253928b)
- 💻 GitHub: [@Adityapatel-dot](https://github.com/Adityapatel-dot)
- 📧 Email: aditya.patel7858@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
⭐ If you found this project helpful, please consider giving it a star!
</div>
