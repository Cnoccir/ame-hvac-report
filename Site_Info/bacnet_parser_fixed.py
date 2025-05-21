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
        with open(file_path, 'r') as f:
            # Get Jace name from first line
            first_line = f.readline().strip().strip('"')
            if "StationName" in first_line:
                parts = first_line.split(',')
                if len(parts) > 1:
                    jace_name = clean_filename(parts[1].strip().strip('"'))
            
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

def generate_report(results, output_dir):
    """Generate a report from the parsed results"""
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Create timestamp for filenames
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Generate report file
    report_filename = f"bacnet_analysis_{timestamp}.txt"
    report_path = os.path.join(output_dir, report_filename)    
    with open(report_path, 'w') as f:
        f.write("=" * 60 + "\n")
        f.write(f"BACnet System Analysis Report\n")
        f.write("=" * 60 + "\n")
        f.write(f"Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        f.write(f"Jace: {results['jace']}\n")
        f.write(f"Number of Trunks: {results['trunk_count']}\n")
        f.write(f"Number of Devices: {results['device_count']}\n")
        
        # Count total points
        total_points = sum(len(points) for points in results['points_by_device'].values())
        f.write(f"Total Points: {total_points}\n\n")
        
        # Status summary
        f.write("Status Summary:\n")
        for status, count in results['status_count'].items():
            percentage = (count / total_points) * 100 if total_points > 0 else 0
            f.write(f"  - {status}: {count} points ({percentage:.1f}%)\n")
        
        # Device details
        f.write("\nDevice Details:\n")
        f.write("-" * 60 + "\n")
        
        for device, points in results['points_by_device'].items():
            f.write(f"\nDevice: {device}\n")
            f.write(f"Number of Points: {len(points)}\n")
            
            # Status breakdown for this device
            status_breakdown = {"ok": 0, "stale": 0, "down": 0, "other": 0}
            for point in points:
                status_breakdown[point['status']] += 1
            
            f.write("Status Breakdown:\n")
            for status, count in status_breakdown.items():
                if count > 0:
                    percentage = (count / len(points)) * 100
                    f.write(f"  - {status}: {count} points ({percentage:.1f}%)\n")    
    print(f"Report generated: {report_path}")
    return report_path

def generate_csv_summary(results, output_dir):
    """Generate CSV summary files"""
    # Create timestamp for filenames
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Create device summary CSV
    device_summary_filename = f"{results['jace']}_device_summary_{timestamp}.csv"
    device_summary_path = os.path.join(output_dir, device_summary_filename)
    
    with open(device_summary_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Device", "Total Points", "OK", "Stale", "Down", "Other"])
        
        for device, points in results['points_by_device'].items():
            # Count statuses for this device
            status_count = {"ok": 0, "stale": 0, "down": 0, "other": 0}
            for point in points:
                status_count[point['status']] += 1
            
            writer.writerow([
                device,
                len(points),
                status_count["ok"],
                status_count["stale"],
                status_count["down"],
                status_count["other"]
            ])
    
    print(f"Device summary saved to: {device_summary_path}")
    
    # Create point details CSV
    point_details_filename = f"{results['jace']}_point_details_{timestamp}.csv"
    point_details_path = os.path.join(output_dir, point_details_filename)    
    with open(point_details_path, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["Device", "Point Folder", "Point Name", "Point Type", "Value", "Status"])
        
        for device, points in results['points_by_device'].items():
            for point in points:
                writer.writerow([
                    device,
                    point["folder"],
                    point["name"],
                    point["type"],
                    point["value"],
                    point["status"]
                ])
    
    print(f"Point details saved to: {point_details_path}")
    
    return {
        "device_summary": device_summary_path,
        "point_details": point_details_path
    }

def main():
    # Project root directory
    project_root = r"C:\ame-fresh"
    
    # Input file in site_info folder
    site_info_dir = os.path.join(project_root, "site_info")
    input_file = os.path.join(site_info_dir, "Clifton_highschool_2.csv")
    
    # Output directory
    output_dir = os.path.join(project_root, "output")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print("=" * 60)
    print("BACnet System Analysis")
    print("=" * 60)
    print(f"Input file: {input_file}")
    print(f"Output directory: {output_dir}")
    print("-" * 60)    
    try:
        # Parse the CSV file
        print("Parsing CSV file...")
        results = parse_csv_file(input_file)
        
        if not results:
            print("Error: Failed to parse CSV file.")
            return
        
        # Generate report
        print("\nGenerating report...")
        report_path = generate_report(results, output_dir)
        
        # Generate CSV summaries
        print("\nGenerating CSV summaries...")
        csv_paths = generate_csv_summary(results, output_dir)
        
        print("\nAnalysis complete!")
        print("=" * 60)
        print(f"Report: {report_path}")
        print(f"Device Summary: {csv_paths['device_summary']}")
        print(f"Point Details: {csv_paths['point_details']}")
        print("=" * 60)
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()