# Check if the .env.example file exists
if [ ! -f ".env.example" ]; then
    echo "Error: '.env.example' file not found in the current directory."
    exit 1
fi

# Copy the contents of .env.example to a new file called .env
cp .env.example .env

echo "Created '.env' file from '.env.example'."