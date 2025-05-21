import os
import sys
import json
import csv
import datetime
import glob
import traceback
from collections import defaultdict

def clean_filename(name):
    """Remove invalid chars from filename"""
    import re
    return re.sub(r'[\\/*?:"<>|\r\n]', "_", name)

def parse_bacnet_csv(file_path):
    """Parse the BACnet CSV file and generate insights"""
    print(f"Parsing BACnet CSV file: {file_path}")
    
    # Initialize data structures
    jace_name = "Unknown"
    devices = {}
    trunks = set()
    points_by_device = defaultdict(list)
    status_counts = {"ok": 0, "stale": 0, "down": 0, "other": 0}
    point_types_by_device = defaultdict(lambda: defaultdict(int))
    
    try:
        with open(file_path, 'r') as f:
            # Get Jace name from first line
            first_line = f.readline().strip().strip('"')
            if "StationName" in first_line:
                parts = first_line.split(',')
                if len(parts) > 1:
                    jace_name = clean_filename(parts[1].strip().strip('"'))
                    print(f"Found Jace name: {jace_name}")
            
            # Skip header line
            f.readline()
            
            # Parse the rest of the file
            line_count = 2  # Already read 2 lines
            current_device = None
            current_trunk = ""            
            # Process the file line by line
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
                    continue
                
                row_type = fields[0]
                network = fields[1]
                trunk = fields[2] if len(fields) > 2 else ""
                device = fields[3] if len(fields) > 3 else ""
                
                # Handle device rows
                if row_type == "Device":
                    current_device = device
                    current_trunk = trunk
                    
                    # Add to data structures
                    if trunk not in trunks:
                        trunks.add(trunk)
                    
                    if device and device not in devices:
                        devices[device] = {
                            "name": device,
                            "trunk": trunk,
                            "points": 0,
                            "point_types": {},
                            "status": {}
                        }
                
                # Handle point rows
                elif row_type == "Point" and current_device:                    # Get point details
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
                    
                    # Add point to device and update counts
                    point_info = {
                        "folder": point_folder,
                        "name": point_name,
                        "type": point_type,
                        "value": value,
                        "status": point_status
                    }
                    
                    points_by_device[current_device].append(point_info)
                    devices[current_device]["points"] += 1
                    
                    # Update status counts
                    status_counts[point_status] += 1
                    if point_status not in devices[current_device]["status"]:
                        devices[current_device]["status"][point_status] = 0
                    devices[current_device]["status"][point_status] += 1
                    
                    # Update point type counts
                    point_types_by_device[current_device][point_type] += 1
                    if point_type not in devices[current_device]["point_types"]:
                        devices[current_device]["point_types"][point_type] = 0
                    devices[current_device]["point_types"][point_type] += 1            
            print(f"Processed {line_count} lines")
            print(f"Found {len(devices)} devices and {sum(len(points) for points in points_by_device.values())} points")
        
        # Prepare trunk data structure for output format
        trunk_details = []
        for trunk_name in sorted(trunks):
            # If trunk is empty, use a default name
            display_trunk = trunk_name if trunk_name else "Default-Trunk"
            
            # Get devices for this trunk
            trunk_devices = [d for d in devices.values() if d["trunk"] == trunk_name]
            trunk_device_count = len(trunk_devices)
            trunk_point_count = sum(d["points"] for d in trunk_devices)
            
            # Prepare device details for this trunk
            device_details = []
            for device in sorted(trunk_devices, key=lambda x: x["name"]):
                # Prepare point type breakdown for this device
                point_breakdown = []
                for point_type, count in device["point_types"].items():
                    point_breakdown.append({
                        "type": point_type,
                        "count": count
                    })
                
                # Calculate device status health
                status_health = {}
                for status, count in device["status"].items():
                    percentage = (count / device["points"]) * 100 if device["points"] > 0 else 0
                    status_health[status] = {
                        "count": count,
                        "percentage": percentage
                    }
                
                # Add device details
                device_details.append({
                    "name": device["name"],
                    "points": device["points"],
                    "pointBreakdown": point_breakdown,
                    "statusHealth": status_health
                })            
            # Add trunk info
            trunk_details.append({
                "name": display_trunk,
                "devices": trunk_device_count,
                "points": trunk_point_count,
                "deviceDetails": device_details
            })
        
        # Create final results structure
        results = {
            "stationName": jace_name,
            "devices": len(devices),
            "points": sum(len(points) for points in points_by_device.values()),
            "trunks": trunk_details,
            "statusCounts": status_counts,
            "healthSummary": {
                "ok": {
                    "count": status_counts["ok"],
                    "percentage": (status_counts["ok"] / sum(status_counts.values())) * 100 if sum(status_counts.values()) > 0 else 0
                },
                "stale": {
                    "count": status_counts["stale"],
                    "percentage": (status_counts["stale"] / sum(status_counts.values())) * 100 if sum(status_counts.values()) > 0 else 0
                },
                "down": {
                    "count": status_counts["down"],
                    "percentage": (status_counts["down"] / sum(status_counts.values())) * 100 if sum(status_counts.values()) > 0 else 0
                },
                "other": {
                    "count": status_counts["other"],
                    "percentage": (status_counts["other"] / sum(status_counts.values())) * 100 if sum(status_counts.values()) > 0 else 0
                }
            }
        }
        
        return results
    
    except Exception as e:
        print(f"Error parsing CSV: {str(e)}")
        traceback.print_exc()
        return None
def generate_json_output(results, output_dir, jace_name):
    """Generate JSON output in the format needed for inventory summary"""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Generate filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    json_filename = f"{jace_name}_device_data_{timestamp}.json"
    json_path = os.path.join(output_dir, json_filename)
    
    # Write JSON file
    with open(json_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"JSON data written to: {json_path}")
    return json_path

def update_inventory_json(new_results, output_dir):
    """Update the inventory JSON file with new results"""
    
    # Path to main device data file
    device_data_path = os.path.join(output_dir, "device-data.json")
    
    # Load existing data or create new data structure
    if os.path.exists(device_data_path):
        with open(device_data_path, 'r') as f:
            try:
                device_data = json.load(f)
            except json.JSONDecodeError:
                print("Error decoding existing JSON, creating new data structure")
                device_data = {}
    else:
        device_data = {}
    
    # Update data with new results
    jace_name = new_results["stationName"]
    device_data[jace_name] = new_results
    
    # Write updated data back to file
    with open(device_data_path, 'w') as f:
        json.dump(device_data, f, indent=2)
    
    print(f"Updated device data in: {device_data_path}")
    return device_data_path
def update_supervisor_json(jace_name, output_dir):
    """Make sure the JACE exists in the supervisors.json file"""
    
    # Path to supervisors data file
    supervisors_path = os.path.join(output_dir, "supervisors.json")
    
    # Current timestamp for health record
    timestamp = datetime.datetime.now().strftime("%d-%b-%y %I:%M %p EDT")
    
    # Default supervisor entry
    new_supervisor = {
        "name": jace_name,
        "address": "10.10.10.XX",
        "hostModel": "TITAN",
        "version": "4.13.2.18",
        "status": "{unackedAlarm}",
        "health": f"Ok [{timestamp}]",
        "clientConn": "Connected",
        "serverConn": "Not connected",
        "virtualsEnabled": False,
        "notes": "Auto-added from BACnet data"
    }
    
    # Load existing data or create new data structure
    if os.path.exists(supervisors_path):
        with open(supervisors_path, 'r') as f:
            try:
                supervisors = json.load(f)
            except json.JSONDecodeError:
                print("Error decoding existing supervisors JSON, creating new data structure")
                supervisors = []
    else:
        supervisors = []
    
    # Check if this JACE already exists
    jace_exists = False
    for supervisor in supervisors:
        if supervisor["name"] == jace_name:
            jace_exists = True
            break
    
    # Add new JACE if it doesn't exist
    if not jace_exists:
        supervisors.append(new_supervisor)
        
        # Write updated data back to file
        with open(supervisors_path, 'w') as f:
            json.dump(supervisors, f, indent=2)
        
        print(f"Added new JACE to supervisors: {jace_name}")
    else:
        print(f"JACE already exists in supervisors: {jace_name}")
    
    return supervisors_path
def generate_summary_report(results, output_dir, jace_name):
    """Generate a summary report in markdown format"""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Generate filename
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    report_filename = f"{jace_name}_summary_{timestamp}.md"
    report_path = os.path.join(output_dir, report_filename)
    
    # Calculate percentages
    total_points = results["points"]
    status_percentages = {}
    for status, count in results["statusCounts"].items():
        percentage = (count / total_points) * 100 if total_points > 0 else 0
        status_percentages[status] = percentage
    
    # Write report file
    with open(report_path, 'w') as f:
        f.write(f"# BACnet System Analysis Report - {jace_name}\n\n")
        f.write(f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write("## System Overview\n\n")
        f.write(f"- **Jace**: {jace_name}\n")
        f.write(f"- **Total Devices**: {results['devices']}\n")
        f.write(f"- **Total Points**: {results['points']}\n\n")
        
        f.write("## Status Summary\n\n")
        f.write("| Status | Count | Percentage |\n")
        f.write("|--------|-------|------------|\n")
        for status, count in results["statusCounts"].items():
            if count > 0:
                f.write(f"| {status} | {count} | {status_percentages[status]:.1f}% |\n")
        f.write("\n")        
        f.write("## Trunk Analysis\n\n")
        for trunk in results["trunks"]:
            f.write(f"### Trunk: {trunk['name']}\n\n")
            f.write(f"- **Devices**: {trunk['devices']}\n")
            f.write(f"- **Points**: {trunk['points']}\n\n")
            
            f.write("#### Device Breakdown\n\n")
            f.write("| Device | Points | Point Types | Status |\n")
            f.write("|--------|--------|-------------|--------|\n")
            
            for device in trunk["deviceDetails"]:
                # Format point types summary
                point_types_summary = ", ".join([f"{pt['type'].split(':')[-1]}: {pt['count']}" 
                                               for pt in device["pointBreakdown"][:3]])
                
                # Format status summary
                status_info = device.get("statusHealth", {})
                status_summary = ", ".join([f"{status}: {info['count']} ({info['percentage']:.1f}%)" 
                                         for status, info in status_info.items() 
                                         if info['count'] > 0])
                
                f.write(f"| {device['name']} | {device['points']} | {point_types_summary} | {status_summary} |\n")
            
            f.write("\n")
    
    print(f"Summary report written to: {report_path}")
    return report_path

def process_csv_file(file_path, output_dir, public_data_dir):
    """Process a single CSV file"""
    try:
        # Parse the CSV file
        print(f"\nProcessing file: {file_path}")
        results = parse_bacnet_csv(file_path)
        
        if not results:
            print("Error: Failed to parse CSV file.")
            return None
        
        # Generate JSON output
        jace_name = results["stationName"]
        print(f"\nGenerating JSON output for {jace_name}...")
        json_path = generate_json_output(results, output_dir, jace_name)        
        # Update inventory data
        print("\nUpdating inventory data...")
        device_data_path = update_inventory_json(results, public_data_dir)
        
        # Update supervisor data
        print("\nUpdating supervisor data...")
        try:
            supervisors_path = update_supervisor_json(jace_name, public_data_dir)
        except Exception as e:
            print(f"Error updating supervisor data: {str(e)}")
            supervisors_path = None
        
        # Generate summary report
        print("\nGenerating summary report...")
        try:
            report_path = generate_summary_report(results, output_dir, jace_name)
        except Exception as e:
            print(f"Error generating summary report: {str(e)}")
            report_path = None
        
        print("\nProcessing complete!")
        print("=" * 60)
        print(f"Results JSON: {json_path}")
        if report_path:
            print(f"Summary report: {report_path}")
        print(f"Device data: {device_data_path}")
        if supervisors_path:
            print(f"Supervisors data: {supervisors_path}")
        print("=" * 60)
        
        # Print brief summary
        print("\nSummary:")
        print(f"Jace: {jace_name}")
        print(f"Devices: {results['devices']}")
        print(f"Points: {results['points']}")
        print("Status Counts:")
        for status, count in results['statusCounts'].items():
            if count > 0:
                percentage = (count / results['points']) * 100 if results['points'] > 0 else 0
                print(f"  - {status}: {count} points ({percentage:.1f}%)")
        
        return {
            "jace_name": jace_name,
            "results": results,
            "json_path": json_path,
            "report_path": report_path
        }    
    except Exception as e:
        print(f"Error processing file {file_path}: {str(e)}")
        traceback.print_exc()
        return None

def main():
    # Project root directory
    project_root = r"C:\ame-fresh"
    
    # Paths
    site_info_dir = os.path.join(project_root, "site_info")
    output_dir = os.path.join(project_root, "output")
    public_data_dir = os.path.join(project_root, "public", "data")
    
    # Create output directories if they don't exist
    for directory in [output_dir, public_data_dir]:
        if not os.path.exists(directory):
            os.makedirs(directory)
    
    print("=" * 60)
    print("BACnet Inventory Summary Parser")
    print("=" * 60)
    print(f"Site info directory: {site_info_dir}")
    print(f"Output directory: {output_dir}")
    print(f"Public data directory: {public_data_dir}")
    print("-" * 60)
    
    # Check command line arguments
    if len(sys.argv) > 1:
        # Process specified file
        file_path = sys.argv[1]
        if not os.path.isabs(file_path):
            file_path = os.path.join(site_info_dir, file_path)
        
        if os.path.exists(file_path):
            process_csv_file(file_path, output_dir, public_data_dir)
        else:
            print(f"Error: File not found: {file_path}")
    else:
        # Process all CSV files in the site_info directory
        csv_files = glob.glob(os.path.join(site_info_dir, "*.csv"))
        
        if not csv_files:
            print(f"No CSV files found in {site_info_dir}")
            return        
        print(f"Found {len(csv_files)} CSV files to process:")
        for i, file_path in enumerate(csv_files):
            print(f"{i+1}. {os.path.basename(file_path)}")
        print()
        
        successful_results = []
        for file_path in csv_files:
            result = process_csv_file(file_path, output_dir, public_data_dir)
            if result:
                successful_results.append(result)
        
        print("\nAll processing complete!")
        print(f"Processed {len(successful_results)} files successfully.")

if __name__ == "__main__":
    main()