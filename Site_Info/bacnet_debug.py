import csv
import os
import datetime
import re
from collections import defaultdict

def clean_filename(name):
    """Remove invalid chars from filename"""
    return re.sub(r'[\\/*?:"<>|\r\n]', "_", name)

def parse_csv_file(file_path):
    """Parse the BACnet CSV file and generate insights"""
    # Initialize data structures
    jace_name = "Unknown"
    devices = {}
    trunks = set()
    points_by_device = defaultdict(list)
    status_count = {"ok": 0, "stale": 0, "down": 0, "other": 0}
    
    try:
        # Debugging info
        print(f"Opening file: {file_path}")
        
        with open(file_path, 'r') as f:
            # Get Jace name from first line
            first_line = f.readline().strip().strip('"')
            print(f"First line: {first_line}")
            
            if "StationName" in first_line:
                parts = first_line.split(',')
                if len(parts) > 1:
                    jace_name = clean_filename(parts[1].strip().strip('"'))
                    print(f"Found Jace name: {jace_name}")
            
            # Skip header line
            header = f.readline().strip()
            print(f"Header line: {header}")
            
            # Parse the rest of the file
            line_count = 2  # Already read 2 lines
            current_device = None            # Process the file line by line instead of using csv reader
            for line in f:
                line_count += 1
                line = line.strip().strip('"')
                
                if not line:
                    continue
                
                # Split the line manually handling the quoted values
                fields = []
                in_quotes = False
                current_field = ""
                
                for char in line:
                    if char == '"':
                        in_quotes = not in_quotes
                    elif char == ',' and not in_quotes:
                        fields.append(current_field.strip())
                        current_field = ""
                    else:
                        current_field += char
                
                # Add the last field
                fields.append(current_field.strip())
                
                # Make sure we have enough fields
                if len(fields) < 4:
                    print(f"Line {line_count}: Not enough fields: {fields}")
                    continue
                
                row_type = fields[0]
                network = fields[1]
                trunk = fields[2]
                device = fields[3]
                
                if row_type == "Device":
                    current_device = device
                    print(f"Line {line_count}: Found Device: {device}")
                    
                    if trunk and trunk not in trunks:
                        trunks.add(trunk)
                    if device and device not in devices:
                        devices[device] = {"trunk": trunk, "points": []}
                
                elif row_type == "Point" and current_device:
                    # Get point details
                    point_folder = fields[6] if len(fields) > 6 else ""
                    point_name = fields[7] if len(fields) > 7 else ""
                    point_type = fields[8] if len(fields) > 8 else ""
                    value = fields[9] if len(fields) > 9 else ""
                    status = fields[10] if len(fields) > 10 else ""                    
                    # Determine point status
                    point_status = "other"
                    if status and "{" in status:
                        status_info = status.strip("{}").split(",")
                        if "ok" in status_info:
                            point_status = "ok"
                        elif "stale" in status_info:
                            point_status = "stale"
                        elif "down" in status_info:
                            point_status = "down"
                    elif value and "{" in value:
                        value_parts = value.split("{")
                        if len(value_parts) > 1:
                            status_info = value_parts[1].strip("}").split(",")
                            if "ok" in status_info:
                                point_status = "ok"
                            elif "stale" in status_info:
                                point_status = "stale"
                            elif "down" in status_info:
                                point_status = "down"
                    
                    # Add point to device
                    point_info = {
                        "folder": point_folder,
                        "name": point_name,
                        "type": point_type,
                        "value": value,
                        "status": point_status
                    }
                    
                    points_by_device[current_device].append(point_info)
                    status_count[point_status] += 1
                    
                    if line_count % 10 == 0:  # Log every 10 points
                        print(f"Line {line_count}: Added point {point_name} to device {current_device}")
            
            print(f"Finished parsing {line_count} lines")
            print(f"Found {len(devices)} devices with {sum(len(points) for points in points_by_device.values())} points")
        
        # Summary statistics
        results = {
            "jace": jace_name,
            "trunk_count": len(trunks),
            "device_count": len(devices),
            "devices": devices,
            "points_by_device": points_by_device,
            "status_count": status_count
        }        
        return results
        
    except Exception as e:
        print(f"Error parsing CSV: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    # Project root directory
    project_root = r"C:\ame-fresh"
    
    # Input file in site_info folder
    site_info_dir = os.path.join(project_root, "site_info")
    input_file = os.path.join(site_info_dir, "Clifton_highschool_2.csv")
    
    print("=" * 60)
    print("BACnet CSV Debug Parser")
    print("=" * 60)
    print(f"Input file: {input_file}")
    print("-" * 60)
    
    try:
        # Parse the CSV file
        print("Parsing CSV file...")
        results = parse_csv_file(input_file)
        
        if not results:
            print("Error: Failed to parse CSV file.")
            return
        
        # Print summary
        print("\nParsing Summary:")
        print(f"Jace: {results['jace']}")
        print(f"Trunks: {results['trunk_count']}")
        print(f"Devices: {results['device_count']}")
        
        total_points = sum(len(points) for points in results['points_by_device'].values())
        print(f"Total Points: {total_points}")
        
        # Print device details
        for device, points in results['points_by_device'].items():
            print(f"\nDevice: {device}")
            print(f"Points: {len(points)}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()