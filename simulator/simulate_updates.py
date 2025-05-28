#!/usr/bin/env python3
import os
import json
import time
import random
import requests
import datetime
from math import sin, cos, radians

# Configuration
ORION_URL = os.getenv('ORION_URL', 'http://localhost:1026')
FIWARE_SERVICE = 'airport'
FIWARE_SERVICE_PATH = '/'

# Headers for API requests
HEADERS = {
    'Content-Type': 'application/json',
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': FIWARE_SERVICE_PATH
}

def get_timestamp():
    return datetime.datetime.now().isoformat()

def update_flight(flight_id):
    # Generate realistic flight data
    status = random.choice(['scheduled', 'boarding', 'taxiing', 'airborne', 'landed'])
    altitude = random.randint(0, 35000) if status == 'airborne' else 0
    speed = random.randint(0, 500) if status == 'airborne' else 0
    heading = random.randint(0, 359)
    
    # Calculate new position (simple circular pattern around airport)
    center_lat, center_lon = 40.6413, -73.7781
    radius = 0.1  # Roughly 11km
    angle = radians(heading)
    lat = center_lat + (radius * sin(angle))
    lon = center_lon + (radius * cos(angle))

    data = {
        "status": {
            "value": status,
            "type": "Text",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "position": {
            "value": {
                "type": "Point",
                "coordinates": [lat, lon]
            },
            "type": "geo:json",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "altitude": {
            "value": altitude,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "speed": {
            "value": speed,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "heading": {
            "value": heading,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        }
    }

    response = requests.patch(
        f"{ORION_URL}/v2/entities/{flight_id}/attrs",
        headers=HEADERS,
        json=data
    )
    
    print(f"Updated flight {flight_id}: {response.status_code}")
    return response.status_code == 204

def update_weather():
    # Generate realistic weather data
    temperature = random.uniform(15, 30)
    wind_speed = random.uniform(0, 25)
    wind_direction = random.randint(0, 359)
    visibility = random.uniform(3, 10)
    precipitation = random.uniform(0, 5)
    cloud_coverage = random.randint(0, 100)
    
    # Determine weather condition based on parameters
    if cloud_coverage < 20:
        condition = "clear"
    elif cloud_coverage < 50:
        condition = "partly cloudy"
    elif precipitation > 2:
        condition = "rain"
    else:
        condition = "cloudy"
    
    # Set weather alert if conditions are severe
    weather_alert = wind_speed > 20 or visibility < 5 or precipitation > 3

    data = {
        "temperature": {
            "value": round(temperature, 1),
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "windSpeed": {
            "value": round(wind_speed, 1),
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "windDirection": {
            "value": wind_direction,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "visibility": {
            "value": round(visibility, 1),
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "precipitation": {
            "value": round(precipitation, 1),
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "cloudCoverage": {
            "value": cloud_coverage,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "condition": {
            "value": condition,
            "type": "Text",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "weatherAlert": {
            "value": weather_alert,
            "type": "Boolean",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        }
    }

    response = requests.patch(
        f"{ORION_URL}/v2/entities/WeatherCondition:Airport1/attrs",
        headers=HEADERS,
        json=data
    )
    
    print(f"Updated weather: {response.status_code}")
    return response.status_code == 204

def update_runway(runway_id):
    # Generate realistic runway data
    status = random.choice(['active', 'active', 'active', 'maintenance'])
    operation = 'maintenance' if status == 'maintenance' else random.choice(['landing', 'takeoff'])
    surface_condition = random.choice(['dry', 'wet', 'snow', 'ice'])
    capacity = random.randint(60, 100) if status == 'active' else 0

    data = {
        "status": {
            "value": status,
            "type": "Text",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "operation": {
            "value": operation,
            "type": "Text",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "surfaceCondition": {
            "value": surface_condition,
            "type": "Text",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        },
        "currentCapacity": {
            "value": capacity,
            "type": "Number",
            "metadata": {
                "timestamp": {
                    "value": get_timestamp(),
                    "type": "DateTime"
                }
            }
        }
    }

    response = requests.patch(
        f"{ORION_URL}/v2/entities/RunwayStatus:{runway_id}/attrs",
        headers=HEADERS,
        json=data
    )
    
    print(f"Updated runway {runway_id}: {response.status_code}")
    return response.status_code == 204

def main():
    print("Starting entity update simulation...")
    
    # Flight IDs to update
    flights = ['UA123', 'BA456', 'DL789', 'AA321']
    runways = ['RW27L', 'RW27R', 'RW09L', 'RW09R']
    
    try:
        while True:
            print("\nUpdating entities...")
            
            # Update flights
            for flight_id in flights:
                update_flight(f"Flight:{flight_id}")
            
            # Update weather
            update_weather()
            
            # Update runways
            for runway_id in runways:
                update_runway(runway_id)
            
            print(f"Updates completed at {get_timestamp()}")
            print("Waiting 10 seconds for next update...")
            time.sleep(10)
            
    except KeyboardInterrupt:
        print("\nSimulation stopped by user")
    except Exception as e:
        print(f"Error in simulation: {e}")

if __name__ == "__main__":
    main()