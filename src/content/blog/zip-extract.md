---
title: "ZIP FILE EXTRACT: THE WEDDING PHOTO PROBLEM"
description: "Zipfile Extract using BASH Script"
pubDate: "September 13, 2023"
heroImage: "/Reception.jpg"
---

**This simple trick saved me 100s of hours**

After our wedding this year, my wife and I received nearly 3,000 photos, distributed across approximately 60 different ZIP files.

This wasn't just a massive use of storage space. This task would require us to individually extract each ZIP file and then sort the photos into the correct folders on our USB drives.

**SOLUTION**

I created a Bash script that automatically iterates through all the ZIP files, pushing the photos into the appropriate folders based on their file names.

**RESULT**

1. Hours saved on manual extraction and sorting
2. Created multiple USB backups, with the ability to set up new ones at any time
3. Peace of mind knowing our photos are safe and we own them

**OVERVIEW**

The script goes through and creates a folder for "Ceremony", "Reception", etc... and puts the photos in the correct folder

**SETUP:**

Step 1: cd into the directory that contains your zips and add Zip_Extract.sh
Step 2: chmod +x the script "chmod +x Zip_Extract"
Step 3: run ./Zip_Extract.sh in your terminal
Step 4: Do whatever you want knowing you don't have to do this!

**CODE**

```bash
#!/bin/bash

# Define the directory containing the zip files
ZIP_DIR="/<SOURCE PATH>" # Replace with the path where your zip files are located

# Define the destination directory on the USB drive
USB_DEST="/<TARGET PATH>" # I used unix and a usb so my path was /Volumes/<USB PATH>

# Navigate to the directory with the zip files
cd "$ZIP_DIR"

# Iterate over each zip file
for zfile in *.zip; do
  # Extract the category name from the zip file name
  CATEGORY=$(echo "$zfile" | cut -d'-' -f1)

  # Create a new directory for the category on the USB drive if it doesn't already exist
  if [ ! -d "$USB_DEST/$CATEGORY" ]; then
    mkdir -p "$USB_DEST/$CATEGORY"
  fi

  # Extract the zip file to the corresponding category directory
  unzip "$zfile" -d "$USB_DEST/$CATEGORY"
done

echo "Files have been extracted to their respective folders on the USB drive."

#chmod +x Zip_Extract.sh
```

PAIN

To give you an insight into ALL of the zip files I was given, they are listed below.

**PAIN**
**List of Zips I extracted from **

| Column 1          | Column 2           | Column 3         |
| ----------------- | ------------------ | ---------------- |
| Ceremony-1.zip    | Preparation-8.zip  | Reception-11.zip |
| Ceremony-2.zip    | Preparation-9.zip  | Reception-12.zip |
| Ceremony-3.zip    | Preparation-10.zip | Reception-13.zip |
| Ceremony-4.zip    | Preparation-11.zip | Reception-14.zip |
| Ceremony-5.zip    | Preparation-12.zip | Reception-15.zip |
| Ceremony-6.zip    | Preparation-13.zip | Reception-16.zip |
| Ceremony-7.zip    | Preparation-14.zip | Reception-17.zip |
| Ceremony-8.zip    | Preparation-15.zip | Reception-18.zip |
| Ceremony-9.zip    | Preparation-16.zip | Reception-19.zip |
| Ceremony-10.zip   | Preparation-17.zip | Reception-20.zip |
| Ceremony-11.zip   | Reception-1.zip    | Reception-21.zip |
| Engagements-1.zip | Reception-2.zip    | Reception-22.zip |
| Engagements-2.zip | Reception-3.zip    | Reception-23.zip |
| Preparation-1.zip | Reception-4.zip    | Reception-24.zip |
| Preparation-2.zip | Reception-5.zip    | Reception-25.zip |
| Preparation-3.zip | Reception-6.zip    | Rehearsal-1.zip  |
| Preparation-4.zip | Reception-7.zip    | Rehearsal-2.zip  |
| Preparation-5.zip | Reception-8.zip    | Rehearsal-3.zip  |
| Preparation-6.zip | Reception-9.zip    | Rehearsal-4.zip  |
| Preparation-7.zip | Reception-10.zip   |                  |

Hope you like it, thanks!

<a href="https://github.com/bmassey-brannen/bash_scripts">Check out the GitHub Repo Here</a>
