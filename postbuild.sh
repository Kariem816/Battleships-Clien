# Delete the old client files
del ../server/public;
# Create a new folder for the client files
mkdir ../server/public;
# Copy the client files to the server
cp -r dist/* ../server/public;