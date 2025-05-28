#!/usr/bin/env python3
import os
import sys
import time
import subprocess

def main():
    print("Starting Airport Digital Twin Simulation...")
    
    # Start the simulator
    try:
        subprocess.run(["python", "simulator.py"], check=True)
    except KeyboardInterrupt:
        print("\nSimulation stopped by user.")
    except subprocess.CalledProcessError as e:
        print(f"Simulation failed with error code: {e.returncode}")
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()