#!/bin/bash

# Configuration
ORION_URL="http://localhost:1026"
FIWARE_SERVICE="airport"
FIWARE_SERVICE_PATH="/"

# Common headers for all requests
HEADERS=(
    -H "Content-Type: application/json"
    -H "fiware-service: ${FIWARE_SERVICE}"
    -H "fiware-servicepath: ${FIWARE_SERVICE_PATH}"
)

# Update flight status
update_flight() {
    local flight_id="Flight:UA123"
    local status="airborne"
    local altitude=35000
    local speed=500
    local heading=270
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    curl "${HEADERS[@]}" \
        -X PATCH "${ORION_URL}/v2/entities/${flight_id}/attrs" \
        -d @- << EOF
{
    "status": {
        "value": "${status}",
        "type": "Text",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "altitude": {
        "value": ${altitude},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "speed": {
        "value": ${speed},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "heading": {
        "value": ${heading},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    }
}
EOF
}

# Update weather conditions
update_weather() {
    local entity_id="WeatherCondition:Airport1"
    local temperature=22.5
    local wind_speed=15.2
    local wind_direction=180
    local visibility=8.5
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    curl "${HEADERS[@]}" \
        -X PATCH "${ORION_URL}/v2/entities/${entity_id}/attrs" \
        -d @- << EOF
{
    "temperature": {
        "value": ${temperature},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "windSpeed": {
        "value": ${wind_speed},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "windDirection": {
        "value": ${wind_direction},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "visibility": {
        "value": ${visibility},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    }
}
EOF
}

# Update runway status
update_runway() {
    local runway_id="RunwayStatus:RW27L"
    local status="active"
    local operation="landing"
    local surface_condition="dry"
    local capacity=90
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    curl "${HEADERS[@]}" \
        -X PATCH "${ORION_URL}/v2/entities/${runway_id}/attrs" \
        -d @- << EOF
{
    "status": {
        "value": "${status}",
        "type": "Text",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "operation": {
        "value": "${operation}",
        "type": "Text",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "surfaceCondition": {
        "value": "${surface_condition}",
        "type": "Text",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    },
    "currentCapacity": {
        "value": ${capacity},
        "type": "Number",
        "metadata": {
            "timestamp": {
                "value": "${timestamp}",
                "type": "DateTime"
            }
        }
    }
}
EOF
}

# Main loop to update entities every 10 seconds
echo "Starting entity updates..."
while true; do
    echo "Updating entities at $(date)"
    update_flight
    update_weather
    update_runway
    echo "Updates completed. Waiting 10 seconds..."
    sleep 10
done