import csv
import os
import datetime
import traceback
from collections import defaultdict

def parse_bacnet_csv(file_path):
    """Parse the BACnet CSV file and extract Jace, Trunk, Device, and Point information."""
    print("Starting to parse file:", file_path)
    
    # Initialize data structures
    data = {
        "jace": None,
        "networks": defaultdict(set),    # network -> set of trunks
        "trunks": defaultdict(set),      # trunk -> set of devices
        "devices": defaultdict(list),    # device -> list of points
        "point_status": defaultdict(lambda: {"ok": 0, "stale": 0, "down": 0, "other": 0}),
        "point_types": defaultdict(lambda: defaultdict(int))
    }
    
    try:
        with open(file_path, 'r') as f:
            # Get the Jace information from the first line
            first_line = f.readline().strip().strip('"')
            print(f"First line: {first_line}")
            jace_parts = first_line.split(',')
            if len(jace_parts) >= 2 and "StationName" in jace_parts[0]:
                data["jace"] = jace_parts[1]
                print(f"Found Jace name: {data['jace']}")
            else:
                data["jace"] = "Unknown_Jace"
                print("Could not determine Jace name, using default")
            
            # Skip the header line
            header_line = f.readline().strip()
            print(f"Header line: {header_line}")
            
            # Create CSV reader for the rest of the file
            reader = csv.reader(f)
            current_device = None
            row_count = 0            
            for row in reader:
                row_count += 1
                if not row or len(row) < 5:  # Skip rows with insufficient columns
                    print(f"Skipping row {row_count}: insufficient columns")
                    continue
                
                # Remove quotes from field values
                row = [field.strip('"') for field in row]
                
                row_type = row[0]
                network = row[1]
                trunk = row[2] if len(row) > 2 else ""
                device = row[3] if len(row) > 3 else ""
                
                if row_type == "Device":
                    current_device = device
                    print(f"Found Device: {device} (Network: {network}, Trunk: {trunk})")
                    
                    # Add device to network and trunk
                    if network:
                        data["networks"][network].add(trunk)
                    if device:
                        data["trunks"][trunk or ""].add(device)
                
                elif row_type == "Point" and current_device:
                    # Get point details
                    point_folder = row[6] if len(row) > 6 else ""
                    point_name = row[7] if len(row) > 7 else ""
                    point_type = row[8] if len(row) > 8 else ""
                    value = row[9] if len(row) > 9 else ""
                    status = row[10] if len(row) > 10 else ""
                    
                    # Parse status from value or status field
                    status_info = []
                    if "{" in value:
                        value_parts = value.split("{", 1)
                        value_clean = value_parts[0].strip()
                        status_part = value_parts[1].rstrip("}")
                        status_info = [s.strip() for s in status_part.split(",")]
                    elif status and "{" in status:
                        status_info = [s.strip() for s in status.strip("{}").split(",")]                    
                    # Determine status category
                    status_category = "other"
                    if "ok" in status_info:
                        status_category = "ok"
                    elif "stale" in status_info:
                        status_category = "stale"
                    elif "down" in status_info:
                        status_category = "down"
                    
                    # Create point data
                    point_data = {
                        "folder": point_folder,
                        "name": point_name,
                        "type": point_type,
                        "value": value,
                        "status": status_category,
                        "status_info": status_info
                    }
                    
                    # Update data structures
                    if current_device:  # Make sure we have a current device
                        data["devices"][current_device].append(point_data)
                        data["point_status"][current_device][status_category] += 1
                        data["point_types"][current_device][point_type] += 1
            
            print(f"Processed {row_count} rows")
            print(f"Found {len(data['networks'])} networks, {len(data['trunks'])} trunks, {len(data['devices'])} devices")
            
            # Count total points
            total_points = 0
            for device, points in data['devices'].items():
                total_points += len(points)
            print(f"Total points: {total_points}")
        
        return data
    except Exception as e:
        print(f"Error reading CSV file: {str(e)}")
        traceback.print_exc()
        raise