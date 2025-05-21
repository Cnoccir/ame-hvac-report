import csv
import os
import datetime
import re
from collections import defaultdict

def parse_csv_file(file_path):
    """Parse the BACnet CSV file and generate insights"""
    # Initialize data structures
    jace_name = "Unknown"
    devices = {}
    trunks = set()
    points_by_device = defaultdict(list)
    status_count = {"ok": 0, "stale": 0, "down": 0, "other": 0}
    
    try:
        with open(file_path, 'r') as f:
            # Get Jace name from first line
            first_line = f.readline().strip().strip('"')
            if "StationName" in first_line:
                parts = first_line.split(',')
                if len(parts) > 1:
                    # Clean up the Jace name to avoid invalid characters in filenames
                    jace_name = parts[1].strip().strip('"')
                    jace_name = re.sub(r'[\\/*?:"<>|]', "_", jace_name)
            
            # Skip header line
            f.readline()            
            # Parse the rest of the file
            reader = csv.reader(f)
            current_device = None
            
            for row in reader:
                # Skip empty rows
                if not row:
                    continue
                
                # Clean up row data
                row = [field.strip('"') for field in row]
                
                # Extract row information
                row_type = row[0] if len(row) > 0 else ""
                network = row[1] if len(row) > 1 else ""
                trunk = row[2] if len(row) > 2 else ""
                device = row[3] if len(row) > 3 else ""
                
                if row_type == "Device":
                    current_device = device
                    if trunk and trunk not in trunks:
                        trunks.add(trunk)
                    if device and device not in devices:
                        devices[device] = {"trunk": trunk, "points": []}
                
                elif row_type == "Point" and current_device:
                    point_folder = row[6] if len(row) > 6 else ""
                    point_name = row[7] if len(row) > 7 else ""
                    point_type = row[8] if len(row) > 8 else ""
                    value = row[9] if len(row) > 9 else ""
                    status = row[10] if len(row) > 10 else ""