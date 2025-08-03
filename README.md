# Microservice Project with Node.js, NestJS, MongoDB & RabbitMQ

This monorepo contains two microservices built with NestJS:

- **Auth Service** — Handles user authentication, JWT issuance, token validation.
- **Product Service** — Manages product catalog CRUD, associates products with users, validates tokens by communicating with Auth Service via RabbitMQ.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Running the Services](#running-the-services)
  - [Without Docker](#without-docker)
  - [Using Docker Compose](#with-docker)
- [Environment Variables](#environment-variables)
- [Inter-Service Communication Flow](#inter-service-communication-flow)
- [Postman Collection](#postman-collection)

---

## Features

- Repository pattern for persistence logic separation  
- Service layer encapsulating business logic  
- Controllers with DTO validation for API layer  
- Strong typing with interfaces and DTOs  
- RabbitMQ communication for authentication and events  
- Centralized logging and error handling  
- Auth Guard integrated in Product Service to protect routes  
- MongoDB with Typegoose for ODM  


---

## Tech Stack
- **NestJS (v10)** – Modular architecture for each service
- **MongoDB** – Database for Auth and Product services
- **RabbitMQ** – Message broker for inter-service communication
- **Typegoose + Mongoose** – MongoDB ODM with TypeScript support
- **Docker + Docker Compose** – Containerized setup for services

---

## Setup Instructions

### Prerequisites

- Node.js (v18+ recommended)  
- MongoDB (local or remote)  
- RabbitMQ (local or remote)  
- npm or yarn  

### Installation

Clone the repo:

```bash
git clone <repo-url>
cd microservice-with-node
```
### Install dependencies for each service:
```bash
cd auth-service
npm install
cd ../product-service
npm install
```

## MongoDB Setup
- Run MongoDB locally or use a hosted provider. Ensure databases:
- install and run MongoDB locally on mongodb://127.0.0.1:27017
- authdb for Auth Service
- product-db for Product Service

## RabbitMQ Setup
- Install and run RabbitMQ locally or use hosted:
- Default connection URL: amqp://localhost:5672
- Define queues: auth_queue, product_queue (as needed)

# Running the Services 
## Without Docker

Run each service individually:

## Auth Service
```bash
cd auth-service
npm npm install 
npm run build
npm run start
```
## Product Service
```bash
cd ../product-service
npm npm install 
npm run build
npm run start
```

## With Docker
At the project root:
```bash
docker-compose build --no-cache                              
docker-compose up -d
```

# Inter-Service Communication Flow

- 1️⃣ Product Service receives a request → Extracts JWT token from Authorization: Bearer <token> header.
- 2️⃣ Product Service AuthGuard → Sends token to Auth Service via RabbitMQ RPC (client.send({ cmd: 'validate_token' })).
- 3️⃣ Auth Service validates token using JwtService.verify() and responds with payload or error.
- 4️⃣ Product Service proceeds with the request (e.g., create product) only if the token is valid.

🛠 Example Flow (Create Product)
```bash
User ->> ProductService: POST /products (with JWT token)
ProductService ->> AuthService: RPC validate_token via RabbitMQ
AuthService ->> ProductService: Response { valid: true, payload: { userId } }
ProductService ->> MongoDB: Create Product with ownerId = userId
ProductService ->> User: 201 Created (Product)
```

## Event Communication:

- User creation or other events can be published to RabbitMQ to notify interested services.

# Notes
- Services can run independently or via Docker Compose.
- Logging and error handling are centralized.
- RabbitMQ queues and exchange names should be consistent across services.

## Postman Collection
https://github.com/utpal21/microservice-project-with-nest/blob/main/Microservice.postman_collection.json