# Wayfare Frontend

Wayfare is a tourism platform that brings destination discovery, recommendations, trip planning and group travel features into one application.

This repository contains the main frontend of Wayfare. It is built with React and Vite and communicates with the Spring Boot backend through REST APIs.

##  Highlights

- Explore destinations, hotels, food, shopping and transport
- Discover places by state and city
- Get recommendations based on trip preferences
- Check whether a selected trip is practical before planning it
- Create and manage travel groups
- GroupGuard features for group travel safety
- JWT based authentication
- Location support and Google Maps links
- Responsive interface using Tailwind CSS

## Overview

The frontend is the main user interface for Wayfare. Users can explore tourism information, select places they want to visit, manage their preferences and move through the trip planning process.

The application communicates with the Wayfare Spring Boot backend for authentication, tourism data, recommendations, groups and other services.

At the current stage, the platform is focused mainly on tourism in Andhra Pradesh and Telangana.

## Usage

Start the application and open it in a browser at `http://localhost:5173`.

The frontend needs the Wayfare backend to be running and reachable through the API URL configured in the environment file.

## Installation

```bash
git clone https://github.com/sihalgorithm-exe/sih-tourism-frontend.git
cd sih-tourism-frontend
npm install
```

Create `.env` from `.env.example` and set:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Then run:

```bash
npm run dev
```

## Authentication

Wayfare uses JWT based authentication.

The frontend attaches the JWT to authenticated API requests. If the backend returns a `401` response because the session is no longer valid, the stored session is cleared and the user is taken back to the login flow.

Authorization is enforced by the backend.

## Related Projects

- [Wayfare Backend](https://github.com/sihalgorithm-exe/sih-tourism-backend)
- [Trip Feasibility](https://github.com/sihalgorithm-exe/trip-feasibility)
- [Wayfare AI Frontend](https://github.com/sihalgorithm-exe/wayfare-ai-frontend)
- [Wayfare AI Backend](https://github.com/sihalgorithm-exe/wayfare-ai-backend)

## About

Wayfare is being developed by the `Algorithm.exe` team as part of Smart India Hackathon.


