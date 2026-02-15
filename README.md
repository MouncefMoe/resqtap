# ResqTap - Emergency Response Guide

A step-by-step emergency response application for lifeguards and first responders, providing 72 emergency guides with detailed first-aid instructions.

## Features

- **72 Emergency Types**: Comprehensive coverage including CPR, choking, burns, fractures, drowning, and more
- **Step-by-Step Instructions**: Clear, actionable steps with visual guidance
- **Severity Classification**: CRITICAL, HIGH, MEDIUM, LOW priority indicators
- **Favorites System**: Save frequently accessed emergencies for quick access
- **Category & Severity Filters**: Quickly find relevant emergencies
- **Offline Support**: Service Worker caching for use without internet
- **PWA Installable**: Install as an app on mobile and desktop
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Capacitor Mobile**: Native iOS and Android app support

## Tech Stack

- **Backend**: Spring Boot 3.5, Java 17, JPA/Hibernate
- **Database**: PostgreSQL (production), H2 (development)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Caching**: Caffeine
- **Mobile**: CapacitorJS 6.x

## Quick Start

### Development

```bash
# Clone the repository
git clone https://github.com/yourusername/resqtap.git
cd resqtap

# Run in development mode (uses H2 in-memory database)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Open in browser
open http://localhost:8080
```

### Running Tests

```bash
./mvnw test
```

### Building for Production

```bash
./mvnw clean package -DskipTests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/crisis` | List all emergencies |
| GET | `/api/crisis/{id}` | Get emergency by ID |
| GET | `/api/crisis/slug/{slug}` | Get by URL slug |
| GET | `/api/crisis/search?term=` | Search emergencies |
| GET | `/api/crisis/category/{category}` | Filter by category |
| GET | `/api/crisis/severity/{severity}` | Filter by severity |
| GET | `/api/crisis/critical` | Get critical emergencies |
| POST | `/api/crisis?role=admin` | Create emergency |
| PUT | `/api/crisis/{id}?role=admin` | Update emergency |
| DELETE | `/api/crisis/{id}?role=admin` | Delete emergency |

## Emergency Categories

- **Cardiac**: CPR (Adult/Child/Infant), Heart Attack, Cardiac Arrest, AED Usage
- **Airway**: Choking (Adult/Child/Infant)
- **Trauma**: Bleeding, Fractures, Sprains, Dislocations, Head/Spinal Injuries
- **Burns**: First/Second/Third Degree, Chemical, Electrical, Sunburn
- **Water**: Drowning, Near Drowning
- **Allergic**: Anaphylaxis, Allergic Reaction, Bee Sting
- **Poisoning**: Ingested, Inhaled, Carbon Monoxide, Drug Overdose, Alcohol, Food
- **Environmental**: Heat Stroke, Heat Exhaustion, Hypothermia, Frostbite, Lightning
- **Medical**: Diabetic Emergencies, Seizures, Stroke, Shock, Appendicitis
- **Bites**: Snake, Spider, Animal, Tick, Jellyfish
- **Eye**: Chemical, Foreign Object
- **Dental**: Knocked Out Tooth, Toothache
- **Pregnancy**: Emergency Childbirth, Miscarriage
- **Mental Health**: Panic Attack, Fainting

## Deployment

### AWS Elastic Beanstalk

1. Build the JAR:
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. Create Elastic Beanstalk environment:
   - Platform: Java 17 / Corretto
   - Instance type: t3.micro (free tier) or larger

3. Configure environment variables:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://<rds-endpoint>:5432/resqtap
   DATABASE_USERNAME=<username>
   DATABASE_PASSWORD=<password>
   ```

4. Upload and deploy `target/resqtap-0.0.1-SNAPSHOT.jar`

### AWS RDS (PostgreSQL)

1. Create RDS PostgreSQL instance (version 14+)
2. Configure security group to allow inbound from Elastic Beanstalk
3. Connect and create database:
   ```sql
   CREATE DATABASE resqtap;
   ```
4. Tables are auto-created by Hibernate on first application run

### Docker (Alternative)

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
COPY target/resqtap-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
docker build -t resqtap .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod resqtap
```

## Mobile App (Capacitor)

### Setup

```bash
cd mobile
npm install
```

### Android

```bash
# Add Android platform
npm run cap:add:android

# Sync and open in Android Studio
npm run android
```

### iOS

```bash
# Add iOS platform (requires macOS)
npm run cap:add:ios

# Sync and open in Xcode
npm run ios
```

## Project Structure

```
resqtap/
├── src/main/java/com/example/resqtap/
│   ├── ResqtapApplication.java      # Entry point
│   ├── config/
│   │   ├── DataSeeder.java          # Seeds 72 emergencies
│   │   ├── CacheConfig.java         # Caffeine cache
│   │   └── SecurityConfig.java      # Security settings
│   ├── controller/
│   │   └── CrisisController.java    # REST API
│   ├── dto/
│   │   └── EmergencyDTO.java        # API response format
│   ├── model/
│   │   ├── Emergency.java           # Emergency entity
│   │   └── Step.java                # Step entity
│   ├── repository/
│   │   ├── EmergencyRepository.java
│   │   └── StepRepository.java
│   └── service/
│       ├── EmergencyService.java    # Business logic
│       └── CrisisService.java       # Legacy service
├── src/main/resources/
│   ├── static/                       # Frontend files
│   │   ├── index.html
│   │   ├── injury.html
│   │   ├── script.js
│   │   ├── injury.js
│   │   ├── style.css
│   │   ├── sw.js                    # Service worker
│   │   ├── manifest.json            # PWA manifest
│   │   └── offline.html
│   ├── application.yml              # Default config
│   ├── application-dev.yml          # Development config
│   └── application-prod.yml         # Production config
├── mobile/                           # Capacitor mobile app
│   ├── capacitor.config.json
│   └── package.json
└── pom.xml
```

## Configuration

### Development (application-dev.yml)
- H2 in-memory database
- H2 Console at `/h2-console`
- Debug logging

### Production (application-prod.yml)
- PostgreSQL database
- Environment variables for sensitive data
- Optimized caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `./mvnw test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Emergency response protocols based on American Red Cross and American Heart Association guidelines
- Step descriptions are for educational purposes and do not replace professional medical training
