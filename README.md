# EKart — Full-Stack Microservices E-Commerce Platform

EKart is a web-based e-commerce platform where customers register, browse products, manage a cart, place orders and pay by debit/credit card. The backend is a set of independent **Spring Boot microservices** (Spring Data JPA + Spring Web MVC), each owning its own **MySQL** schema, fronted by a **Spring Cloud Gateway** and discovered through a **Eureka** registry. The frontend is a polished **React + TypeScript (Vite)** single-page app styled with **Bootstrap 5 + custom CSS3**.

> This project re-implements the original Angular reference frontend as **React + TypeScript** while preserving the documented page structure, routing and REST API contracts.

---

## Architecture

```mermaid
flowchart TD
    subgraph Client
        FE["React + TypeScript SPA<br/>(Vite · Bootstrap 5)<br/>:5173"]
    end

    subgraph Edge
        GW["API Gateway<br/>(Spring Cloud Gateway)<br/>:8080"]
    end

    subgraph Discovery
        EUREKA["Eureka Service Registry<br/>:8761"]
    end

    subgraph Services
        CUST["Customer Service<br/>(Auth · JWT · Profile)<br/>:8081"]
        PROD["Product Service<br/>(Catalog · Search)<br/>:8082"]
        CART["Cart Service<br/>:8083"]
        ORDER["Order Service<br/>:8084"]
        PAY["Payment Service<br/>(Cards · Payments)<br/>:8085"]
    end

    subgraph Databases
        DBC[("ekart_customer")]
        DBP[("ekart_product")]
        DBT[("ekart_cart")]
        DBO[("ekart_order")]
        DBY[("ekart_payment")]
    end

    FE -->|REST over HTTP| GW

    GW --> CUST
    GW --> PROD
    GW --> CART
    GW --> ORDER
    GW --> PAY

    CUST -. registers .-> EUREKA
    PROD -. registers .-> EUREKA
    CART -. registers .-> EUREKA
    ORDER -. registers .-> EUREKA
    PAY -. registers .-> EUREKA
    GW   -. discovers .-> EUREKA

    CART -->|OpenFeign| PROD
    ORDER -->|OpenFeign| CART
    ORDER -->|OpenFeign| PROD
    ORDER -->|OpenFeign| CUST
    PAY  -->|OpenFeign| ORDER

    CUST --- DBC
    PROD --- DBP
    CART --- DBT
    ORDER --- DBO
    PAY  --- DBY
```

### How a purchase flows

1. **Customer Service** authenticates the user and issues a **JWT**. The frontend stores it and sends it as `Authorization: Bearer <token>` through the gateway.
2. **Product Service** serves the catalog and case-insensitive name/brand search.
3. **Cart Service** keeps a per-customer cart, validating products against **Product Service** via OpenFeign.
4. **Order Service** reads the cart, computes the total and discount (**10% credit / 5% debit**), snapshots line items, reduces inventory in **Product Service**, clears the cart, and creates an order in `PENDING_PAYMENT`.
5. **Payment Service** validates the card + CVV (CVV is **BCrypt-hashed**, never stored in clear text), records the payment, and asks **Order Service** to mark the order `CONFIRMED`.

---

## Port map

| Component            | Service name (Eureka) | Port  | Database          | Base path        |
|----------------------|-----------------------|-------|-------------------|------------------|
| Eureka Registry      | `eureka-server`       | 8761  | —                 | `/` (dashboard)  |
| API Gateway          | `api-gateway`         | 8080  | —                 | (all `/*-api/**`)|
| Customer Service     | `customer-service`    | 8081  | `ekart_customer`  | `/customer-api`  |
| Product Service      | `product-service`     | 8082  | `ekart_product`   | `/product-api`   |
| Cart Service         | `cart-service`        | 8083  | `ekart_cart`      | `/cart-api`      |
| Order Service        | `order-service`       | 8084  | `ekart_order`     | `/order-api`     |
| Payment Service      | `payment-service`     | 8085  | `ekart_payment`   | `/payment-api`   |
| Frontend (Vite dev)  | —                     | 5173  | —                 | —                |

The frontend talks **only** to the gateway (`http://localhost:8080`). CORS for `http://localhost:5173` is configured in both the gateway and the Customer Service security config.

---

## Prerequisites

- **JDK 21**
- **Maven 3.9+** (or use the bundled `mvnw` wrapper if present)
- **MySQL 8.x** running on `localhost:3306`
- **Node.js 18+** and **npm**

The sample configs assume MySQL user `root` / password `root`. Change them in each service's `src/main/resources/application.yml` (an `application-example.yml` documents every property).

---

## 1. Set up the databases

Each service owns its own schema (database-per-service). Run the scripts in `database/` — they create the schema **and** insert sample seed data:

```bash
mysql -u root -p < database/01_customer_schema.sql
mysql -u root -p < database/02_product_schema.sql
mysql -u root -p < database/03_cart_schema.sql
mysql -u root -p < database/04_order_schema.sql
mysql -u root -p < database/05_payment_schema.sql
```

> The services also use `ddl-auto: update`, so they will create/upgrade tables on first run even if you skip the scripts — but the scripts give you the **seed data** (sample products, a demo customer and a sample card).

**Demo credentials** (created by the seed scripts):

| Email                    | Password    |
|--------------------------|-------------|
| `john.doe@example.com`   | `Ekart@123` |
| `jane.smith@example.com` | `Ekart@123` |

A sample **credit card** for `john.doe@example.com` is seeded with CVV `123`.

---

## 2. Start the backend (run each service independently)

Start them **in this order** so discovery works cleanly. Open a separate terminal per service:

```bash
# 1) Service registry (must be first)
cd eureka-server   && mvn spring-boot:run

# 2) API gateway
cd api-gateway     && mvn spring-boot:run

# 3) Domain services (any order)
cd customer-service && mvn spring-boot:run
cd product-service  && mvn spring-boot:run
cd cart-service     && mvn spring-boot:run
cd order-service    && mvn spring-boot:run
cd payment-service  && mvn spring-boot:run
```

- Eureka dashboard: <http://localhost:8761> — all services should appear `UP`.
- Gateway health: <http://localhost:8080/actuator/health>

To build a runnable jar instead of `spring-boot:run`:

```bash
cd customer-service && mvn clean package
java -jar target/customer-service-1.0.0.jar
```

---

## 3. Start the frontend

```bash
cd frontend
cp .env.example .env      # sets VITE_API_BASE_URL=http://localhost:8080
npm install
npm run dev               # http://localhost:5173
```

Build for production: `npm run build` then `npm run preview`.

---

## Project structure

```
ekart/
├── eureka-server/          # Netflix Eureka service registry
├── api-gateway/            # Spring Cloud Gateway (single entry point + CORS)
├── customer-service/       # Register, login, JWT, profile         (ekart_customer)
├── product-service/        # Product catalog + search              (ekart_product)
├── cart-service/           # Shopping cart (Feign → product)       (ekart_cart)
├── order-service/          # Order placement + history (Feign)     (ekart_order)
├── payment-service/        # Cards + payments (BCrypt CVV, Feign)  (ekart_payment)
├── database/               # One SQL schema + seed script per service
└── frontend/               # React + TypeScript (Vite) SPA
```

Every Spring Boot service follows the same package layout under `com.ekart.<domain>`:

```
entity/        JPA entities
repository/    Spring Data JpaRepository interfaces
service/       business logic (@Service)
controller/    @RestController REST endpoints
dto/           request/response DTOs
client/        OpenFeign clients (where applicable)
config/        security / JWT / app beans
exception/     EkartException + GlobalExceptionHandler
```

---

## REST API summary (through the gateway)

All paths below are relative to `http://localhost:8080`.

### Customer API — `/customer-api`
| Method | Path                       | Description            | Auth |
|--------|----------------------------|------------------------|------|
| POST   | `/register`                | Create an account      | No   |
| POST   | `/login`                   | Authenticate, get JWT  | No   |
| GET    | `/customer/{emailId}`      | Get profile            | JWT  |

### Product API — `/product-api`
| Method | Path                              | Description           |
|--------|-----------------------------------|-----------------------|
| GET    | `/products`                       | List all products     |
| GET    | `/product/{productId}`            | Get one product       |
| GET    | `/products/search?q=term`         | Case-insensitive search|
| PUT    | `/product/{productId}/reduce-stock` | Internal: reduce stock|

### Cart API — `/cart-api`
| Method | Path                                                 | Description          |
|--------|------------------------------------------------------|----------------------|
| POST   | `/products`                                          | Add product(s) to cart|
| GET    | `/customer/{emailId}/products`                       | Get cart products    |
| PUT    | `/customer/{emailId}/product/{productId}`            | Update quantity      |
| DELETE | `/customer/{emailId}/product/{productId}`            | Remove product       |

### Order API — `/order-api`
| Method | Path                                  | Description          |
|--------|---------------------------------------|----------------------|
| POST   | `/place-order`                        | Place order from cart|
| GET    | `/customer/{emailId}/orders`          | Order history        |
| GET    | `/order/{orderId}`                    | Internal: get order  |
| PUT    | `/order/{orderId}/confirm`            | Internal: confirm    |

### Payment API — `/payment-api`
| Method | Path                                          | Description       |
|--------|-----------------------------------------------|-------------------|
| POST   | `/customer/{emailId}/cards`                   | Add a card        |
| GET    | `/customer/{emailId}/card-type/{cardType}`    | List cards        |
| POST   | `/customer/{emailId}/order/{orderId}`         | Make a payment    |

---

## Frontend routes

| Route                  | Page                | Notes                          |
|------------------------|---------------------|--------------------------------|
| `/login`               | Login               | Public                         |
| `/register`            | Register            | Public, full validation        |
| `/`                    | Home                | Protected, hero + featured     |
| `/products`            | Products            | Grid + live search suggestions |
| `/products/:productId` | Product details     | Quantity + Add to Cart         |
| `/cart`                | Cart                | Update qty, delete, subtotal   |
| `/place-order`         | Checkout            | Card → confirm → CVV → pay     |
| `/orders`              | My Orders           | Order history                  |
| `/cards`               | My Cards            | Add/list cards                 |
| `/profile`             | My Details          | Customer profile               |

State is managed with **React Context + `useReducer`** (`AuthContext`, `CartContext`, `ToastContext`). API calls go through a single **Axios** instance that attaches the JWT and normalises error messages. Every API shape is strongly typed in `src/types` — there is no `any` in the codebase.

---

## Security notes

- Passwords and card CVVs are hashed with **BCrypt**; raw CVVs are never stored.
- The Customer Service issues HMAC-signed JWTs. Override the secret in production via the `EKART_JWT_SECRET` environment variable.
- The seeded demo secrets/passwords are for local development only — rotate them before any real deployment.

---

## Tech stack

**Backend:** Java 21, Spring Boot 3.3, Spring Web MVC, Spring Data JPA (Hibernate), Spring Security, Spring Cloud Gateway, Netflix Eureka, OpenFeign, MySQL, jjwt.

**Frontend:** React 18, TypeScript 5, Vite 5, React Router v6, Axios, Bootstrap 5, custom CSS3.
