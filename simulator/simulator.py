#!/usr/bin/env python3
import os
import json
import time
import random
import requests
import datetime
import threading
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
ORION_URL = os.getenv('ORION_URL', 'http://orion:1026')
IOT_AGENT_URL = os.getenv('IOT_AGENT_URL', 'http://iot-agent:4041')
FIWARE_SERVICE = 'airport'
FIWARE_SERVICE_PATH = '/'

# Headers for API requests
HEADERS = {
    'Content-Type': 'application/json',
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': FIWARE_SERVICE_PATH
}

# Global data
flights = {}
weather_conditions = {}
runways = {}

# Initialize airport data
def initialize_data():
    # Initialize runways
    runways_data = [
        {
            'id': 'RunwayStatus:RW27L',
            'type': 'RunwayStatus',
            'runwayId': {'type': 'Text', 'value': 'RW27L'},
            'name': {'type': 'Text', 'value': 'Runway 27 Left'},
            'length': {'type': 'Number', 'value': 3500, 'metadata': {'unit': {'type': 'Text', 'value': 'meters'}}},
            'status': {'type': 'Text', 'value': 'active', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'operation': {'type': 'Text', 'value': 'landing', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'visibility': {'type': 'Number', 'value': 10, 'metadata': {'unit': {'type': 'Text', 'value': 'kilometers'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'surfaceCondition': {'type': 'Text', 'value': 'dry', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'nextScheduledMaintenance': {'type': 'DateTime', 'value': (datetime.datetime.now() + datetime.timedelta(days=15)).isoformat()},
            'currentCapacity': {'type': 'Number', 'value': 90, 'metadata': {'unit': {'type': 'Text', 'value': 'percent'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'location': {'type': 'geo:json', 'value': {'type': 'LineString', 'coordinates': [[40.6413, -73.7781], [40.6550, -73.7925]]}}
        },
        {
            'id': 'RunwayStatus:RW27R',
            'type': 'RunwayStatus',
            'runwayId': {'type': 'Text', 'value': 'RW27R'},
            'name': {'type': 'Text', 'value': 'Runway 27 Right'},
            'length': {'type': 'Number', 'value': 3200, 'metadata': {'unit': {'type': 'Text', 'value': 'meters'}}},
            'status': {'type': 'Text', 'value': 'active', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'operation': {'type': 'Text', 'value': 'takeoff', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'visibility': {'type': 'Number', 'value': 10, 'metadata': {'unit': {'type': 'Text', 'value': 'kilometers'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'surfaceCondition': {'type': 'Text', 'value': 'dry', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'nextScheduledMaintenance': {'type': 'DateTime', 'value': (datetime.datetime.now() + datetime.timedelta(days=10)).isoformat()},
            'currentCapacity': {'type': 'Number', 'value': 85, 'metadata': {'unit': {'type': 'Text', 'value': 'percent'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'location': {'type': 'geo:json', 'value': {'type': 'LineString', 'coordinates': [[40.6400, -73.7770], [40.6537, -73.7914]]}}
        },
        {
            'id': 'RunwayStatus:RW09L',
            'type': 'RunwayStatus',
            'runwayId': {'type': 'Text', 'value': 'RW09L'},
            'name': {'type': 'Text', 'value': 'Runway 09 Left'},
            'length': {'type': 'Number', 'value': 3500, 'metadata': {'unit': {'type': 'Text', 'value': 'meters'}}},
            'status': {'type': 'Text', 'value': 'active', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'operation': {'type': 'Text', 'value': 'takeoff', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'visibility': {'type': 'Number', 'value': 10, 'metadata': {'unit': {'type': 'Text', 'value': 'kilometers'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'surfaceCondition': {'type': 'Text', 'value': 'dry', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'nextScheduledMaintenance': {'type': 'DateTime', 'value': (datetime.datetime.now() + datetime.timedelta(days=20)).isoformat()},
            'currentCapacity': {'type': 'Number', 'value': 95, 'metadata': {'unit': {'type': 'Text', 'value': 'percent'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'location': {'type': 'geo:json', 'value': {'type': 'LineString', 'coordinates': [[40.6550, -73.7925], [40.6413, -73.7781]]}}
        },
        {
            'id': 'RunwayStatus:RW09R',
            'type': 'RunwayStatus',
            'runwayId': {'type': 'Text', 'value': 'RW09R'},
            'name': {'type': 'Text', 'value': 'Runway 09 Right'},
            'length': {'type': 'Number', 'value': 3200, 'metadata': {'unit': {'type': 'Text', 'value': 'meters'}}},
            'status': {'type': 'Text', 'value': 'maintenance', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'operation': {'type': 'Text', 'value': 'maintenance', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'visibility': {'type': 'Number', 'value': 10, 'metadata': {'unit': {'type': 'Text', 'value': 'kilometers'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'surfaceCondition': {'type': 'Text', 'value': 'dry', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'nextScheduledMaintenance': {'type': 'DateTime', 'value': (datetime.datetime.now() + datetime.timedelta(hours=4)).isoformat()},
            'currentCapacity': {'type': 'Number', 'value': 0, 'metadata': {'unit': {'type': 'Text', 'value': 'percent'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'location': {'type': 'geo:json', 'value': {'type': 'LineString', 'coordinates': [[40.6537, -73.7914], [40.6400, -73.7770]]}}
        }
    ]
    
    # Initialize weather
    weather_data = {
        'id': 'WeatherCondition:Airport1',
        'type': 'WeatherCondition',
        'location': {'type': 'geo:json', 'value': {'type': 'Point', 'coordinates': [40.6413, -73.7781]}},
        'temperature': {'type': 'Number', 'value': 22.4, 'metadata': {'unit': {'type': 'Text', 'value': 'celsius'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'windSpeed': {'type': 'Number', 'value': 8.5, 'metadata': {'unit': {'type': 'Text', 'value': 'knots'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'windDirection': {'type': 'Number', 'value': 270, 'metadata': {'unit': {'type': 'Text', 'value': 'degrees'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'visibility': {'type': 'Number', 'value': 10, 'metadata': {'unit': {'type': 'Text', 'value': 'kilometers'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'precipitation': {'type': 'Number', 'value': 0, 'metadata': {'unit': {'type': 'Text', 'value': 'mm/h'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'cloudCoverage': {'type': 'Number', 'value': 25, 'metadata': {'unit': {'type': 'Text', 'value': 'percent'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'weatherAlert': {'type': 'Boolean', 'value': False, 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
        'condition': {'type': 'Text', 'value': 'partly cloudy', 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}}
    }
    
    # Initialize flights
    airlines = ['UA', 'BA', 'DL', 'AA', 'LH', 'AF', 'EK']
    origins = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'SFO', 'ORD']
    destinations = ['ATL', 'DFW', 'FRA', 'SYD', 'HND', 'AMS', 'MAD']
    aircraft_types = ['Boeing 737-800', 'Airbus A320', 'Boeing 777-300ER', 'Airbus A350-900', 'Boeing 787-9']
    
    flights_data = []
    
    for i in range(20):
        airline = random.choice(airlines)
        flight_num = random.randint(100, 999)
        callsign = f"{airline}{flight_num}"
        
        # Determine if flight is arriving or departing
        is_arriving = random.choice([True, False])
        
        if is_arriving:
            status = random.choice(['scheduled', 'airborne'])
            origin = random.choice(origins)
            destination = 'JFK'  # Our airport
            assigned_runway = random.choice(['RW27L', 'RW09L'])
        else:
            status = random.choice(['scheduled', 'boarding', 'taxiing', 'airborne'])
            origin = 'JFK'  # Our airport
            destination = random.choice(destinations)
            assigned_runway = random.choice(['RW27R', 'RW09R'])
        
        # Set position based on status
        if status == 'airborne':
            lat = 40.0 + random.uniform(-10, 10)
            lng = -73.0 + random.uniform(-10, 10)
            altitude = random.randint(5000, 35000)
            speed = random.randint(300, 550)
            heading = random.randint(0, 359)
        else:
            lat = 40.6413
            lng = -73.7781
            altitude = 0
            speed = 0
            heading = 0
        
        # Set estimated arrival time
        hours_to_arrival = random.randint(0, 5)
        minutes_to_arrival = random.randint(0, 59)
        estimated_arrival = (datetime.datetime.now() + datetime.timedelta(hours=hours_to_arrival, minutes=minutes_to_arrival)).isoformat()
        
        flight_data = {
            'id': f"Flight:{callsign}",
            'type': 'Flight',
            'callSign': {'type': 'Text', 'value': callsign},
            'aircraftType': {'type': 'Text', 'value': random.choice(aircraft_types)},
            'origin': {'type': 'Text', 'value': origin},
            'destination': {'type': 'Text', 'value': destination},
            'status': {'type': 'Text', 'value': status, 'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}},
            'position': {
                'type': 'geo:json',
                'value': {'type': 'Point', 'coordinates': [lat, lng]},
                'metadata': {'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}
            },
            'altitude': {
                'type': 'Number',
                'value': altitude,
                'metadata': {'unit': {'type': 'Text', 'value': 'feet'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}
            },
            'speed': {
                'type': 'Number',
                'value': speed,
                'metadata': {'unit': {'type': 'Text', 'value': 'knots'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}
            },
            'heading': {
                'type': 'Number',
                'value': heading,
                'metadata': {'unit': {'type': 'Text', 'value': 'degrees'}, 'timestamp': {'type': 'DateTime', 'value': get_timestamp()}}
            },
            'estimatedArrival': {'type': 'DateTime', 'value': estimated_arrival},
            'assignedRunway': {'type': 'Text', 'value': assigned_runway}
        }
        
        flights_data.append(flight_data)
    
    # Create entities in Orion
    for runway in runways_data:
        create_entity(runway)
        runways[runway['id']] = runway
    
    create_entity(weather_data)
    weather_conditions[weather_data['id']] = weather_data
    
    for flight in flights_data:
        create_entity(flight)
        flights[flight['id']] = flight
    
    print(f"Initialized {len(runways)} runways, {len(weather_conditions)} weather conditions, and {len(flights)} flights")

# Helper function to get current timestamp in ISO format
def get_timestamp():
    return datetime.datetime.now().isoformat()

# Create entity in Orion
def create_entity(entity_data):
    response = requests.post(
        f"{ORION_URL}/v2/entities",
        headers=HEADERS,
        json=entity_data
    )
    
    if response.status_code == 201:
        print(f"Entity {entity_data['id']} created successfully")
    elif response.status_code == 422:
        # Entity already exists, update it
        update_entity(entity_data)
    else:
        print(f"Failed to create entity {entity_data['id']}: {response.status_code} {response.text}")

# Update entity in Orion
def update_entity(entity_data):
    entity_id = entity_data['id']
    
    # Remove id and type from the payload
    update_data = entity_data.copy()
    update_data.pop('id', None)
    update_data.pop('type', None)
    
    response = requests.patch(
        f"{ORION_URL}/v2/entities/{entity_id}/attrs",
        headers=HEADERS,
        json=update_data
    )
    
    if response.status_code == 204:
        print(f"Entity {entity_id} updated successfully")
    else:
        print(f"Failed to update entity {entity_id}: {response.status_code} {response.text}")

# Simulate changes to flight data
def simulate_flight_changes():
    while True:
        try:
            for flight_id, flight in flights.items():
                if flight['status']['value'] == 'airborne':
                    # Update position
                    current_lat = flight['position']['value']['coordinates'][0]
                    current_lng = flight['position']['value']['coordinates'][1]
                    heading = flight['heading']['value']
                    speed = flight['speed']['value']
                    
                    # Calculate new position based on heading and speed
                    lat_change = math.sin(math.radians(heading)) * speed * 0.0001
                    lng_change = math.cos(math.radians(heading)) * speed * 0.0001
                    
                    new_lat = current_lat + lat_change
                    new_lng = current_lng + lng_change
                    
                    flight['position']['value']['coordinates'] = [new_lat, new_lng]
                    flight['position']['metadata']['timestamp']['value'] = get_timestamp()
                    
                    # Occasionally change altitude
                    if random.random() < 0.3:
                        altitude_change = random.choice([-1000, -500, 0, 500, 1000])
                        new_altitude = max(5000, min(40000, flight['altitude']['value'] + altitude_change))
                        flight['altitude']['value'] = new_altitude
                        flight['altitude']['metadata']['timestamp']['value'] = get_timestamp()
                    
                    # Occasionally change speed
                    if random.random() < 0.2:
                        speed_change = random.choice([-50, -25, 0, 25, 50])
                        new_speed = max(300, min(600, flight['speed']['value'] + speed_change))
                        flight['speed']['value'] = new_speed
                        flight['speed']['metadata']['timestamp']['value'] = get_timestamp()
                    
                    # Occasionally change status for arrivals
                    if flight['destination']['value'] == 'JFK' and random.random() < 0.1:
                        if flight['altitude']['value'] < 10000:
                            flight['status']['value'] = 'landing'
                            flight['status']['metadata']['timestamp']['value'] = get_timestamp()
                        
                # Update entity in Orion
                update_entity(flight)
                
            # Sleep for simulation interval
            time.sleep(5)
        except Exception as e:
            print(f"Error in flight simulation: {e}")
            time.sleep(5)

# Simulate changes to weather conditions
def simulate_weather_changes():
    while True:
        try:
            for weather_id, weather in weather_conditions.items():
                # Occasionally change temperature
                if random.random() < 0.2:
                    temp_change = random.uniform(-0.5, 0.5)
                    weather['temperature']['value'] = round(weather['temperature']['value'] + temp_change, 1)
                    weather['temperature']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Occasionally change wind
                if random.random() < 0.2:
                    wind_speed_change = random.uniform(-1, 1)
                    wind_dir_change = random.randint(-10, 10)
                    
                    weather['windSpeed']['value'] = max(0, round(weather['windSpeed']['value'] + wind_speed_change, 1))
                    weather['windDirection']['value'] = (weather['windDirection']['value'] + wind_dir_change) % 360
                    
                    weather['windSpeed']['metadata']['timestamp']['value'] = get_timestamp()
                    weather['windDirection']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Occasionally change cloud coverage and precipitation
                if random.random() < 0.1:
                    cloud_change = random.randint(-5, 5)
                    precip_change = random.uniform(-0.2, 0.2)
                    
                    weather['cloudCoverage']['value'] = max(0, min(100, weather['cloudCoverage']['value'] + cloud_change))
                    weather['precipitation']['value'] = max(0, round(weather['precipitation']['value'] + precip_change, 1))
                    
                    weather['cloudCoverage']['metadata']['timestamp']['value'] = get_timestamp()
                    weather['precipitation']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Determine weather condition
                if weather['cloudCoverage']['value'] < 20:
                    weather['condition']['value'] = 'clear'
                elif weather['cloudCoverage']['value'] < 50:
                    weather['condition']['value'] = 'partly cloudy'
                elif weather['cloudCoverage']['value'] < 80:
                    weather['condition']['value'] = 'cloudy'
                else:
                    weather['condition']['value'] = 'rain'
                
                # Set weather alert if conditions are severe
                if weather['windSpeed']['value'] > 25 or weather['precipitation']['value'] > 5:
                    weather['weatherAlert']['value'] = True
                else:
                    weather['weatherAlert']['value'] = False
                
                weather['condition']['metadata']['timestamp']['value'] = get_timestamp()
                weather['weatherAlert']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Update visibility based on conditions
                if weather['condition']['value'] == 'clear':
                    weather['visibility']['value'] = 10
                elif weather['condition']['value'] == 'partly cloudy':
                    weather['visibility']['value'] = 8
                elif weather['condition']['value'] == 'cloudy':
                    weather['visibility']['value'] = 6
                else:  # rain
                    weather['visibility']['value'] = 4
                
                weather['visibility']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Update entity in Orion
                update_entity(weather)
                
            # Sleep for simulation interval
            time.sleep(30)
        except Exception as e:
            print(f"Error in weather simulation: {e}")
            time.sleep(5)

# Simulate changes to runway status
def simulate_runway_changes():
    while True:
        try:
            for runway_id, runway in runways.items():
                # Occasionally change runway capacity
                if random.random() < 0.2:
                    capacity_change = random.randint(-5, 5)
                    if runway['status']['value'] == 'active':
                        runway['currentCapacity']['value'] = max(60, min(100, runway['currentCapacity']['value'] + capacity_change))
                    runway['currentCapacity']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Occasionally change surface condition based on weather
                if random.random() < 0.1:
                    weather = list(weather_conditions.values())[0]  # Assume one weather condition for the airport
                    if weather['precipitation']['value'] > 1:
                        runway['surfaceCondition']['value'] = 'wet'
                    else:
                        runway['surfaceCondition']['value'] = 'dry'
                    runway['surfaceCondition']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Occasionally change operation type
                if random.random() < 0.05 and runway['status']['value'] == 'active':
                    runway['operation']['value'] = random.choice(['landing', 'takeoff'])
                    runway['operation']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Update visibility from weather
                weather = list(weather_conditions.values())[0]
                runway['visibility']['value'] = weather['visibility']['value']
                runway['visibility']['metadata']['timestamp']['value'] = get_timestamp()
                
                # Update entity in Orion
                update_entity(runway)
                
            # Sleep for simulation interval
            time.sleep(60)
        except Exception as e:
            print(f"Error in runway simulation: {e}")
            time.sleep(5)

# Main function
def main():
    print("Starting Airport Digital Twin Simulator...")
    
    # Initialize data
    print("Initializing airport data...")
    initialize_data()
    
    # Start simulation threads
    print("Starting simulation threads...")
    flight_thread = threading.Thread(target=simulate_flight_changes, daemon=True)
    weather_thread = threading.Thread(target=simulate_weather_changes, daemon=True)
    runway_thread = threading.Thread(target=simulate_runway_changes, daemon=True)
    
    flight_thread.start()
    weather_thread.start()
    runway_thread.start()
    
    print("Simulation running. Press Ctrl+C to stop.")
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Shutting down simulator...")

if __name__ == "__main__":
    # Import math here to avoid issues if not present in the global scope
    import math
    main()