<div align="center">
  
### ⚠️       Archived Project       ⚠️
</div>

This repository represents an early prototype and is no longer under active development. It is preserved to document my learning process and early design exploration. The README after my reflection shows the project as it existed during development.

<div align="center">
  
### Reflection: What I Learned
</div>

- Designing responsive layouts using HTML and CSS
- Embedding OpenStreetMap into a web application
- Planning interactions between UI components
- Breaking large software ideas into smaller milestones

This project also taught me the importance of defining an achievable project scope before beginning development.

---
<br>

# DAYMAP

![Archived](https://img.shields.io/badge/status-archived-lightgrey)
![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Java-orange)
![Competition](https://img.shields.io/badge/CAC-Maryland%202nd%20District%202026-green)

*An application project built in progress for the upcoming 2026 Congressional App Challenge (MD-02)*

## What is DAYMAP?

Many people like ourselves have find it hard juggling between multiple different apps to manage a busy day, usually: a calendar for events, a notes / to-do app for tasks, a GPS navigation app for directions, and a transit app for bus and rail routes. Obviously none of these apps were interconnected with each other. Google Maps doesn't know you have a work shift at 6pm. Your calendar doesn't know how long it takes to drive between your stops. Your to-do app does not know either.

Thats why we built DAYMAP. 

DAYMAP is a daily life organizer app that combines personal task management, real-time map visualization, and driving / public transportation route optimization in a single coherent interface.

**Essentially, DAYMAP puts all of your daily logistics in one place**

That's it. That's the whole idea. One app that knows your schedule **AND** knows where everything is **AND** helps you get there efficiently. Isn't that so convenient?

---

## App Features
* **Dual Panel Interface:** Simultaneous timeline in the left side and a live map view on the right side
  
* **Drive Mode:** Multi-stop driving route optimization using OSRM.
  
* **Transit Mode:** Integrated MTA transit routing (Bus, Light Rail, Metro SubwayLink, and MARC).
  
* **To-Do Task Cards:** Color-coded categories with deadline proximity indicators.
  
* **PIN Lock:** 4-digit PIN protection for shared device environments
  
* **Privacy-First:** All data is stored locally in the browser by default.
  
* **PWA Ready:** Installable on Android and iOS with offline caching.  

---

## Planned Tech Stack

### Frontend
| Tech | Purpose |
| :--- | :--- |
| **Vanilla JavaScript** ES6+ | Application logic |
| **HTML5 / CSS3** | Structure and styling |

### API's
| API | Purpose |
| :--- | :--- |
| **Leaflet.js** | Interactive map rendering using OpenStreetMap |
| **OpenStreetMap** | Map tile data |
| **OSRM** | Driving route calculation and road geometry |
| **Nominatim** | Free geocoding and location search |
| **Navitia** | Multi-modal transit routing for the Maryland MTA network |

### Backend
| Tech | Purpose |
| :--- | :--- |
| **Java 17** | Backend language  |
| **Spring Boot 3** | REST API framework |

---

## Privacy Notice

We treat privacy as our number #1 priority of our app. A personal planner should never become a surveillance tool.

---

## Made by
Kent Esteban and Aayush Sapkota  
Towson High School, Class of 2028

---

## Built for
**2026 Congressional App Challenge**  
Maryland's 2nd Congressional District  
Representative Johnny Olszewski

*Submission deadline: October 26, 2026*
