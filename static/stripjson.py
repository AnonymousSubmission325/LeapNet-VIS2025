import json
import math
import os

# Get directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Use full path to file in same directory
input_filename = os.path.join(script_dir, "key_projections.json")
output_filename = os.path.join(script_dir, "key_projections_top10.json")

# Read full data
with open(input_filename, "r", encoding="utf-8") as f:
    data = json.load(f)

# Keep top 10%
top_n = math.ceil(len(data) * 0.1)
reduced_data = data[:top_n]

# Write reduced data
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(reduced_data, f, separators=(",", ":"))

print(f"✅ Saved top 10% to {output_filename} (kept {top_n} of {len(data)} entries)")
