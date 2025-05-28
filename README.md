# Airport Control Tower Digital Twin

This project implements a Digital Twin solution for simulating and monitoring flight conditions in an airport control tower. The system uses FIWARE components to create digital representations of flights, weather conditions, and runway statuses, providing real-time visualization and monitoring capabilities.

## Project Structure

```
project/
├── webapp/                 # Frontend React application
│   ├── src/               # Source code
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── App.tsx       # Main App component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── simulator/             # Flight and weather data simulator
├── grafana/              # Grafana dashboards and configuration
└── docker-compose.yml    # Docker services configuration
```

## Quick Start

### Development Mode

1. Clone the repository:
```bash
git clone https://github.com/your-username/airport-digital-twin.git
cd airport-digital-twin
```

2. Start the frontend development server:
```bash
cd webapp
npm install
npm run dev
```
The development server will be available at http://localhost:3000

### Production Mode (Docker)

1. Make sure Docker and Docker Compose are installed

2. Create required directories for persistence:
```bash
mkdir -p grafana/dashboards
mkdir -p grafana/provisioning/datasources
mkdir -p grafana/provisioning/dashboards
```

3. Start all services:
```bash
docker compose up -d
```

4. Access the applications:
- Main Web Application: http://localhost:80
- Grafana Dashboards: http://localhost:3000
- FIWARE Orion: http://localhost:1026
- IoT Agent: http://localhost:4041
- QuantumLeap API: http://localhost:8668
- CrateDB Admin: http://localhost:4200

## Project Context

### What is being simulated?

This Digital Twin simulates the operational environment of an airport control tower, focusing on:

1. **Flight Tracking**: Real-time monitoring of aircraft positions, altitudes, speeds, and flight paths
2. **Runway Status**: Current status of each runway (active, inactive, maintenance)
3. **Weather Conditions**: Live weather data including wind speed/direction, visibility, precipitation, and temperature

### Why is this simulation valuable?

- **Training**: Provides a safe environment for air traffic controller training
- **Efficiency Analysis**: Enables analysis of airport operations to optimize flight scheduling and runway usage
- **Weather Impact Assessment**: Helps understand how changing weather conditions affect airport operations
- **Emergency Response Planning**: Allows simulation of emergency scenarios and response procedures
- **Capacity Planning**: Supports data-driven decision making for airport expansion and capacity management

## Data Models (NGSI-v2 Format)

### Flight Entity

```json
{
  "id": "Flight:UA123",
  "type": "Flight",
  "callSign": {
    "type": "Text",
    "value": "UA123"
  },
  "aircraftType": {
    "type": "Text", 
    "value": "Boeing 737-800"
  },
  "origin": {
    "type": "Text",
    "value": "SFO"
  },
  "destination": {
    "type": "Text",
    "value": "JFK"
  },
  "status": {
    "type": "Text",
    "value": "airborne",
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:03:00Z"
      }
    }
  },
  "position": {
    "type": "geo:json",
    "value": {
      "type": "Point",
      "coordinates": [37.7749, -122.4194]
    },
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:05:00Z"
      }
    }
  },
  "altitude": {
    "type": "Number",
    "value": 35000,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "feet"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:05:00Z"
      }
    }
  },
  "speed": {
    "type": "Number",
    "value": 550,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "knots"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:05:00Z"
      }
    }
  },
  "heading": {
    "type": "Number",
    "value": 78,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "degrees"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:05:00Z"
      }
    }
  },
  "estimatedArrival": {
    "type": "DateTime",
    "value": "2023-05-01T15:30:00Z"
  },
  "assignedRunway": {
    "type": "Text",
    "value": "RW27L"
  }
}
```

### WeatherCondition Entity

```json
{
  "id": "WeatherCondition:Airport1",
  "type": "WeatherCondition",
  "location": {
    "type": "geo:json",
    "value": {
      "type": "Point",
      "coordinates": [40.6413, -73.7781]
    }
  },
  "temperature": {
    "type": "Number",
    "value": 22.4,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "celsius"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "windSpeed": {
    "type": "Number",
    "value": 15.2,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "knots"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "windDirection": {
    "type": "Number",
    "value": 270,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "degrees"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "visibility": {
    "type": "Number",
    "value": 10,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "kilometers"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "precipitation": {
    "type": "Number",
    "value": 0,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "mm/h"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "cloudCoverage": {
    "type": "Number",
    "value": 25,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "percent"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "weatherAlert": {
    "type": "Boolean",
    "value": false,
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "condition": {
    "type": "Text",
    "value": "partly cloudy",
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  }
}
```

### RunwayStatus Entity

```json
{
  "id": "RunwayStatus:RW27L",
  "type": "RunwayStatus",
  "runwayId": {
    "type": "Text",
    "value": "RW27L"
  },
  "name": {
    "type": "Text",
    "value": "Runway 27 Left"
  },
  "length": {
    "type": "Number",
    "value": 3500,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "meters"
      }
    }
  },
  "status": {
    "type": "Text",
    "value": "active",
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "operation": {
    "type": "Text",
    "value": "landing",
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "visibility": {
    "type": "Number",
    "value": 10,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "kilometers"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "surfaceCondition": {
    "type": "Text",
    "value": "dry",
    "metadata": {
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "nextScheduledMaintenance": {
    "type": "DateTime",
    "value": "2023-05-15T00:00:00Z"
  },
  "currentCapacity": {
    "type": "Number",
    "value": 90,
    "metadata": {
      "unit": {
        "type": "Text",
        "value": "percent"
      },
      "timestamp": {
        "type": "DateTime",
        "value": "2023-05-01T12:00:00Z"
      }
    }
  },
  "location": {
    "type": "geo:json",
    "value": {
      "type": "LineString",
      "coordinates": [
        [40.6413, -73.7781],
        [40.6550, -73.7925]
      ]
    }
  }
}
```

## System Architecture and Services

This Digital Twin solution is built using a microservices architecture with the following components:

### 1. Orion Context Broker
The core component that manages context information. It stores the current state of all entities and handles subscriptions and queries.

### 2. MongoDB
The database used by Orion Context Broker to store entity data.

### 3. IoT Agent for JSON
Translates IoT device protocols to NGSI-v2 format for compatibility with Orion.

### 4. QuantumLeap
Stores historical context data by subscribing to changes in Orion.

### 5. CrateDB
A distributed SQL database that stores time-series data for QuantumLeap.

### 6. Grafana
Provides visualization dashboards for monitoring the airport's digital twin data.

### 7. Web Application
The frontend interface that displays the Digital Twin information in a user-friendly manner.

### 8. Data Simulator
Generates simulated flight, weather, and runway data to feed into the system.

## Installation Process

### Prerequisites
- Docker and Docker Compose installed
- Git
- 4GB+ RAM available for running containers

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/your-username/airport-digital-twin.git
cd airport-digital-twin
```

2. Create required directories for persistence:
```bash
mkdir -p grafana/dashboards
mkdir -p grafana/provisioning/datasources
mkdir -p grafana/provisioning/dashboards
```

3. Configure Grafana datasource:
Create `grafana/provisioning/datasources/datasource.yml`:
```bash
cat > grafana/provisioning/datasources/datasource.yml << 'EOF'
apiVersion: 1

datasources:
  - name: CrateDB
    type: postgres
    url: crate:5432
    database: doc
    user: crate
    secureJsonData:
      password: ""
    jsonData:
      sslmode: "disable"
      postgresVersion: 1200
      timescaledb: false
    isDefault: true
EOF
```

4. Configure Grafana dashboards:
Create `grafana/provisioning/dashboards/dashboards.yml`:
```bash
cat > grafana/provisioning/dashboards/dashboards.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'Airport Digital Twin'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
EOF
```

5. Start all services using Docker Compose:
```bash
docker-compose up -d
```

6. Verify all services are running:
```bash
docker-compose ps
```

## How to Launch the Application

### 1. Access the Web Interface

Open your browser and navigate to:
- Main Web Application: http://localhost:80
- Grafana Dashboards: http://localhost:3000 (default credentials: admin/admin)

### 2. Initialize the Simulation

1. Generate the initial entities by running the data simulator script:
```bash
docker exec -it airport-simulator python init_simulation.py
```

2. Start the continuous simulation:
```bash
docker exec -it airport-simulator python start_simulation.py
```

### 3. Query Entity Data

You can query the entities directly from Orion Context Broker:

- Get all flight entities:
```bash
curl -X GET 'http://localhost:1026/v2/entities?type=Flight' \
  -H 'fiware-service: airport' \
  -H 'fiware-servicepath: /' | jq
```

- Get all weather conditions:
```bash
curl -X GET 'http://localhost:1026/v2/entities?type=WeatherCondition' \
  -H 'fiware-service: airport' \
  -H 'fiware-servicepath: /' | jq
```

- Get all runway statuses:
```bash
curl -X GET 'http://localhost:1026/v2/entities?type=RunwayStatus' \
  -H 'fiware-service: airport' \
  -H 'fiware-servicepath: /' | jq
```

### 4. Subscribe to Entity Changes

Set up a subscription to be notified when entities change:

```bash
curl -X POST 'http://localhost:1026/v2/subscriptions' \
  -H 'Content-Type: application/json' \
  -H 'fiware-service: airport' \
  -H 'fiware-servicepath: /' \
  -d '{
  "description": "Notify QuantumLeap of all entity changes",
  "subject": {
    "entities": [
      {
        "idPattern": ".*",
        "typePattern": ".*"
      }
    ]
  },
  "notification": {
    "http": {
      "url": "http://quantumleap:8668/v2/notify"
    }
  }
}'
```

### 5. Modify Simulation Parameters

You can modify simulation parameters to change behavior:

```bash
docker exec -it airport-simulator python modify_parameters.py --weather-condition storm --wind-speed 30
```

## Results and Visualization

### Flight Tracking Dashboard

![Flight Tracking Dashboard](https://images.pexels.com/photos/236153/pexels-photo-236153.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

The Flight Tracking Dashboard displays real-time information about all flights, including:
- Current position on a map
- Altitude and speed graphs
- Flight status (scheduled, boarding, airborne, landed)
- Estimated arrival times
- Flight path visualization

### Weather Monitoring Dashboard

![Weather Monitoring Dashboard](https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

The Weather Monitoring Dashboard shows:
- Current temperature, wind speed, and direction
- Visibility conditions
- Precipitation levels
- Weather alerts
- Historical weather trends
- Impact of weather on flight operations

### Runway Status Dashboard

![Runway Status Dashboard](https://images.pexels.com/photos/358220/pexels-photo-358220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

The Runway Status Dashboard displays:
- Current status of all runways (active/inactive)
- Current operations (takeoff/landing/maintenance)
- Surface conditions
- Capacity utilization
- Scheduled maintenance periods
- Historical usage patterns

## Advanced Features

### Data Analysis

The system provides advanced data analysis capabilities:
- Predictive maintenance for runways based on usage patterns
- Flight delay predictions based on weather conditions
- Capacity optimization recommendations
- Anomaly detection for unusual flight patterns or weather events

### API Integration

The Digital Twin exposes APIs for integration with external systems:
- Weather data services
- Flight scheduling systems
- Maintenance management systems
- Emergency response systems

### Simulation Scenarios

The system supports various simulation scenarios:
- Normal operations
- Severe weather events
- Emergency situations
- High traffic conditions
- Maintenance operations

## Contributing

Contributions to this project are welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.