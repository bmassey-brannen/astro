---
title: "The Wedding Photo ZIP Problem"
description: "Using a small Bash script to extract and sort dozens of wedding photo ZIP files."
pubDate: "September 13, 2023"
heroImage: "/Reception.jpg"
---

After our wedding, my wife and I received nearly 3,000 photos spread across about 60 ZIP files.

That sounded great until I realized what the job actually was: open every ZIP, extract the photos, sort them into folders, and repeat the process for multiple USB backups.

I did not want to spend a weekend clicking through archive files.

## The fix

I wrote a small Bash script that loops through the ZIP files, reads the category from each file name, creates the matching folder on the USB drive, and extracts the photos into the right place.

For file names like `Ceremony-1.zip`, `Reception-12.zip`, or `Preparation-4.zip`, the script uses the part before the dash as the folder name.

## Result

- The manual extraction job dropped from hours to minutes.
- I could create multiple USB backups the same way every time.
- The folder structure stayed consistent.
- I kept ownership of the photos instead of leaving everything trapped in downloads and random archives.

## Setup

1. Put `Zip_Extract.sh` in the folder with your ZIP files.
2. Set `ZIP_DIR` to the folder containing the ZIP files.
3. Set `USB_DEST` to the destination drive or backup folder.
4. Run `chmod +x Zip_Extract.sh`.
5. Run `./Zip_Extract.sh`.

## Code

```bash
#!/bin/bash

# Folder containing the zip files
ZIP_DIR="/<SOURCE PATH>"

# Destination folder or USB drive
USB_DEST="/<TARGET PATH>"

cd "$ZIP_DIR" || exit 1

for zfile in *.zip; do
  CATEGORY=$(echo "$zfile" | cut -d'-' -f1)

  if [ ! -d "$USB_DEST/$CATEGORY" ]; then
    mkdir -p "$USB_DEST/$CATEGORY"
  fi

  unzip "$zfile" -d "$USB_DEST/$CATEGORY"
done

echo "Files have been extracted to their folders."
```

## The pile

This was the kind of file list I was trying to avoid handling one by one:

```
Ceremony-1.zip      Preparation-8.zip   Reception-11.zip
Ceremony-2.zip      Preparation-9.zip   Reception-12.zip
Ceremony-3.zip      Preparation-10.zip  Reception-13.zip
Ceremony-4.zip      Preparation-11.zip  Reception-14.zip
Ceremony-5.zip      Preparation-12.zip  Reception-15.zip
Ceremony-6.zip      Preparation-13.zip  Reception-16.zip
Ceremony-7.zip      Preparation-14.zip  Reception-17.zip
Ceremony-8.zip      Preparation-15.zip  Reception-18.zip
Ceremony-9.zip      Preparation-16.zip  Reception-19.zip
Ceremony-10.zip     Preparation-17.zip  Reception-20.zip
Ceremony-11.zip     Reception-1.zip     Reception-21.zip
Engagements-1.zip   Reception-2.zip     Reception-22.zip
Engagements-2.zip   Reception-3.zip     Reception-23.zip
Preparation-1.zip   Reception-4.zip     Reception-24.zip
Preparation-2.zip   Reception-5.zip     Reception-25.zip
Preparation-3.zip   Reception-6.zip     Rehearsal-1.zip
Preparation-4.zip   Reception-7.zip     Rehearsal-2.zip
Preparation-5.zip   Reception-8.zip     Rehearsal-3.zip
Preparation-6.zip   Reception-9.zip     Rehearsal-4.zip
Preparation-7.zip   Reception-10.zip
```

<a href="https://github.com/bmassey-brannen/bash_scripts">Check out the GitHub repo here</a>
