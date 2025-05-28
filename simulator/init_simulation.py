#!/usr/bin/env python3
import requests
import os
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

def create_fiware_service():
    print("Creating FIWARE service...")
    
    # Create service in IoT Agent
    iot_agent_url = os.getenv('IOT_AGENT_URL', 'http://iot-agent:4041')
    service_data = {
        "services": [
            {
                "apikey": "airport123",
                "cbroker": ORION_URL,
                "entity_type": "Device",
                "resource": "/iot/json"
            }
        ]
    }
    
    response = requests.post(
        f"{iot_agent_url}/iot/services",
        headers=HEADERS,
        json=service_data
    )
    
    if response.status_code == 201:
        print("FIWARE service created successfully")
    elif response.status_code == 409:
        print("FIWARE service already exists")
    else:
        print(f"Failed to create FIWARE service: {response.status_code} {response.text}")

def create_subscription_to_quantumleap():
    print("Creating subscription to QuantumLeap...")
    
    subscription_data = {
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
        },
        "throttling": 1
    }
    
    response = requests.post(
        f"{ORION_URL}/v2/subscriptions",
        headers=HEADERS,
        json=subscription_data
    )
    
    if response.status_code == 201:
        print("Subscription to QuantumLeap created successfully")
    else:
        print(f"Failed to create subscription: {response.status_code} {response.text}")

def main():
    print("Initializing Airport Digital Twin Simulation...")
    
    # Create FIWARE service
    create_fiware_service()
    
    # Create subscription to QuantumLeap for historical data
    create_subscription_to_quantumleap()
    
    print("Initialization complete. Run 'python simulator.py' to start the simulation.")

if __name__ == "__main__":
    main()