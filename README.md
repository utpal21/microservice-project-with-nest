# Microservice Project with Node.js, NestJS, MongoDB & RabbitMQ

This monorepo contains two microservices built with NestJS:

- **Auth Service** — Handles user authentication, JWT issuance, token validation.
- **Product Service** — Manages product catalog CRUD, associates products with users, validates tokens by communicating with Auth Service via RabbitMQ.

---

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running the Services](#running-the-services)
  - [Without Docker](#without-docker)
  - [Using Docker Compose](#using-docker-compose)
- [Environment Variables](#environment-variables)
- [Inter-Service Communication Flow](#inter-service-communication-flow)

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

# Inter-Service Communication Flow
## User Authentication: 
- Handled by Auth Service with JWT tokens.

## Product Service:

- On each request to protected routes, Product Service extracts the JWT from Authorization header.
- Product Service sends a message via RabbitMQ to Auth Service with the token to validate it (validate_token message pattern).
- Auth Service verifies the token and responds with validation status and user info.
- Product Service allows or denies access based on Auth Service response.

## Event Communication:

- User creation or other events can be published to RabbitMQ to notify interested services.

# Notes
- Services can run independently or via Docker Compose.
- Logging and error handling are centralized.
- RabbitMQ queues and exchange names should be consistent across services.
