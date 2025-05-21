import json
import os

def search_jace_data(file_path, jace_name):
    """Search for a specific Jace in the device-data.json file and print its data."""
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    if jace_name in data:
        print(f"Found Jace: {jace_name}")
        print(json.dumps(data[jace_name], indent=2))
    else:
        print(f"Jace '{jace_name}' not found in the data.")
        # Print available Jaces
        print("Available Jaces:")
        for jace in data.keys():
            print(f"- {jace}")

if __name__ == "__main__":
    project_root = r"C:\ame-fresh"
    file_path = os.path.join(project_root, "public", "data", "device-data.json")
    jace_name = "CliftonHighSchoolHWS"
    
    search_jace_data(file_path, jace_name)
