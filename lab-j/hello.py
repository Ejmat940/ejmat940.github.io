import sys

name = "Bartosz"
index = "57773"

python_version = sys.version.split()[0]
python_path = sys.executable

print(f"Hello {name} ({index}). This environment is using Python version {python_version} at location {python_path}.")
