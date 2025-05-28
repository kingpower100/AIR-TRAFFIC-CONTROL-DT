#!/usr/bin/env python3
import os
import argparse
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
ORION_URL = os.getenv('ORION_URL', 'http://orion:1026')
FIWARE_SERVICE = 'airport'
FIWARE_SERVICE_PATH = '/'

# Headers for API requests
HEADERS = {
    'Content-Type': 'application/json',
    'fiware-service': FIWARE_SERVICE,
    'fiware-servicepath': FIWARE_SERVICE_PATH
}

def modify_weather_condition(condition):
    print(f"Changing weather condition to: {condition}")
    
    # Predefined condition mappings
    condition_mappings = {
        "clear": {
            "cloudCoverage": 10,
            "precipitation": 0,
            "visibility": 10,
            "weatherAlert": False
        },
        "cloudy": {
            "cloudCoverage": 70,
            "precipitation": 0,
            "visibility": 8,
            "weatherAlert": False
        },
        "rain": {
            "cloudCoverage": 90,
            "precipitation": 3,
            "visibility": 5,
            "weatherAlert": False
        },
        "storm": {
            "cloudCoverage": 100,
            "precipitation": 8,
            "visibility": 3,
            "weatherAlert": True
        },
        "fog": {
            "cloudCoverage": 50,
            "precipitation": 0,
            "visibility": 2,
            "weatherAlert": True
        }
    }
    
    if condition not in condition_mappings:
        print(f"Unknown condition: {condition}. Available conditions: {', '.join(condition_mappings.keys())}")
        return
    
    
    # Prepare update payload
    update_data = {
        "condition": {
            "type": "Text",
            "value": condition
        },
        "cloudCoverage": {
            "type": "Number",
            "value": condition_mappings[condition]["cloudCoverage"]
        },
        "precipitation": {
            "type": "Number",
            "value": condition_mappings[condition]["precipitation"]
        },
        "visibility": {
            "type": "Number",
            "value": condition_mappings[condition]["visibility"]
        },
        "weatherAlert": {
            "type": "Boolean",
            "value": condition_mappings[condition]["weatherAlert"]
        }
    }
    
    # Update entity in Orion
    response = requests.patch(
        f"{ORION_URL}/v2/entities/WeatherCondition:Airport1/attrs",
        headers=HEADERS,
        json=update_data
    )
    
    if response.status_code == 204:
        print(f"Weather condition updated successfully to {condition}")
    else:
        print(f"Failed to update weather condition: {response.status_code} {response.text}")

def modify_wind_speed(speed):
    print(f"Changing wind speed to: {speed} knots")
    
    # Prepare update payload
    update_data = {
        "windSpeed": {
            "type": "Number",
            "value": speed
        }
    }
    
    # Update entity in Orion
    response = requests.patch(
        f"{ORION_URL}/v2/entities/WeatherCondition:Airport1/attrs",
        headers=HEADERS,
        json=update_data
    )
    
    if response.status_code == 204:
        print(f"Wind speed updated successfully to {speed} knots")
    else:
        print(f"Failed to update wind speed: {response.status_code} {response.text}")

def modify_runway_status(runway_id, status):
    print(f"Changing runway {runway_id} status to: {status}")
    
    if status not in ['active', 'inactive', 'maintenance']:
        print(f"Invalid status: {status}. Available statuses: active, inactive, maintenance")
        return
    
    # Prepare update payload
    update_data = {
        "status": {
            "type": "Text",
            "value": status
        }
    }
    
    # If maintenance, set operation to maintenance and capacity to 0
    if status == 'maintenance':
        update_data["operation"] = {
            "type": "Text",
            "value": "maintenance"
        }
        update_data["currentCapacity"] = {
            "type": "Number",
            "value": 0
        }
    
    # Update entity in Orion
    response = requests.patch(
        f"{ORION_URL}/v2/entities/RunwayStatus:{runway_id}/attrs",
        headers=HEADERS,
        json=update_data
    )
    
    if response.status_code == 204:
        print(f"Runway {runway_id} status updated successfully to {status}")
    else:
        print(f"Failed to update runway status: {response.status_code} {response.text}")

def main():
    parser = argparse.ArgumentParser(description='Modify Airport Digital Twin Simulation Parameters')
    parser.add_argument('--weather-condition', choices=['clear', 'cloudy', 'rain', 'storm', 'fog'], 
                      help='Set weather condition')
    parser.add_argument('--wind-speed', type=float, help='Set wind speed in knots')
    parser.add_argument('--runway-status', nargs=2, metavar=('RUNWAY_ID', 'STATUS'),
                      help='Set runway status (e.g., RW27L active)')
    
    args = parser.parse_args()
    
    if args.weather_condition:
        modify_weather_condition(args.weather_condition)
    
    if args.wind_speed is not None:
        modify_wind_speed(args.wind_speed)
    
    if args.runway_status:
        runway_id, status = args.runway_status
        modify_runway_status(runway_id, status)
    
    if not any([args.weather_condition, args.wind_speed is not None, args.runway_status]):
        parser.print_help()

if __name__ == "__main__":
    main()