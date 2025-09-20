# Product Requirements Document (PRD)

**Product Name**: Personal AI Dashboard  
**Version**: 0.1  
**Date**: 2025-07-04  
**Owner**: Jahye Ali Hussen

---

## 1. Overview

This project aims to develop a **full-stack AI-powered personal dashboard** designed to help users monitor, understand, and improve key aspects of their lives—such as **fitness, finances, mental well-being**, and **daily routines**. All user data will be tracked automatically via external APIs when possible, or manually through the app itself. AI-generated insights will support habit formation and reflection.

Though initially developed for personal use, the solution is designed with future **scalability and public usability** in mind.

---

## 2. Goals

- Centralize life tracking across fitness, finances, routines, and mindfulness.
- Enable **habit consistency** and reflection via AI-generated insights.
- Provide a simple and intuitive user experience with clean visualizations.
- Establish a robust backend and frontend foundation for **future extensibility**.
- Deliver a **portfolio-ready prototype within 1 week**.

---

## 3. Key Features & Milestones

### Milestone 1: MVP Dashboard + Companion App

- **Frontend (Web + Mobile)**  
  - React web app (Vite + Tailwind)  
  - React Native (Expo + Tailwind)  
  - Light/dark theme with orange accents

- **Widgets for**:  
  - Daily steps  
  - Calories  
  - Mood tracking  
  - Net worth / financial balance  
  - Journal entries  
  - Prayer streaks

- **Manual and automatic tracking**  
  - Input forms in app for mood, journal, prayer, and finances  
  - Step and calorie tracking via integrations

- **Authentication**: Google login (OAuth2)  
- **Integrations**: Google Calendar API  
- **Backend**:  
  - .NET Web API (Node.js optional fallback)  

---

### Milestone 2: AI Insight Engine

- Weekly AI-generated summaries:
  - Mood and mental patterns
  - Physical activity trends
  - Financial behavior
  - Journal analysis (via NLP)

- Actionable advice and routine suggestions  
- AI tone: reflective and motivational  
- Early burnout or inconsistency detection

---

### Milestone 3: Future Expansion

- iOS HealthKit integration (via mobile app bridge)  
- Push notifications for reminders and habits  
- Multi-user support  
- Custom AI fine-tuned per user history

---

### Milestone 4: Home Assistant Integration

- API integration with Home Assistant to collect:
  - Sleep data  
  - Environment info (temperature, noise, presence)

- Event logging from Home Assistant into dashboard  
- Automation triggers (e.g., mood-based lighting suggestions)

---

## 4. Functional Requirements

### Frontend

- Responsive UI with modular components  
- Dashboard displaying all active trackers and summaries  
- Forms for user input (mood, finances, journal, etc.)  
- Authentication flow (Google login)

### Backend

- REST API for:
  - User profile
  - Entry CRUD (steps, mood, journal, prayer, finances)
  - Weekly summary aggregation

### AI Integration

- Connect to OpenAI API  
- Summarize entries and generate weekly reports (Context Specific)
- Accept context from user history and habits

---

## 5. Non-Functional Requirements

- **Performance**: Mobile-friendly and lightweight load time  
- **Scalability**: MongoDB for document-style flexibility  
- **Maintainability**: Modular code with separation of concerns (MVC + service layer)  
- **Security** (future): Plan for authentication tokens and encrypted storage if public  
- **Accessibility**: Basic adherence to WCAG AA via contrast and layout

---

## 6. Design Guidelines

- **Color scheme**: White/Grey/Black + Orange accents  
- **Typography**: Clear, readable fonts (e.g., Inter or Roboto)  
- **Tone**: Friendly, non-judgmental, and encouraging  
- **Layout**: Widget-style cards with summary graphs and AI tips

---

## 7. Success Criteria

- Fully functional MVP within 1 week  
- At least 5 working widgets with proper data tracking  
- AI-generated feedback on at least 3 domains (e.g., fitness, journaling, mood)  
- Seamless Google login and Calendar sync  
- Clear, portfolio-ready demo
