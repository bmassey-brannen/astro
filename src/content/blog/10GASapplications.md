---
title: "10 Applications of Google Apps Scripts"
description: "Ten practical Google Apps Script ideas I keep coming back to."
pubDate: "March 20, 2023"
heroImage: "/gas.jpg"
---

Google Apps Script is one of those tools that looks boring until it saves you from doing the same spreadsheet chore for the 80th time.

Here are ten places I reach for it.

**Automate emails from Google Sheets**

Send invoices, confirmations, reminders, or follow-ups from rows in a sheet. `MailApp` and `GmailApp` are usually enough to get started.

**Generate QR codes**

Create QR codes for items, events, check-ins, or internal labels, then save the images back to Drive or a Sheet.

**Convert Google Sheets to PDF**

Turn a sheet or report tab into a PDF and save it to Drive. Useful for recurring reports that should not require manual exporting.

**Automate data entry**

Move data between tabs, clean imported rows, fill templates, or normalize messy form responses. This is where Apps Script pays for itself.

**Create custom menus and sidebars**

Add a menu item to a Sheet or Doc so a workflow feels like part of the file instead of a separate script nobody remembers to run.

**Use triggers**

Run a script on a schedule or when a file changes. This is great for daily reports, cleanup jobs, and alerting when a sheet gets updated.

**Create Google Forms**

Build or update forms programmatically when the questions come from another data source.

**Connect to APIs**

Pull data from Google Analytics, internal tools, or third-party services with `UrlFetchApp`, then drop the results into a Sheet.

**Extract data from websites**

Fetch public pages and parse the pieces you need. It is not a replacement for a real scraper, but for small jobs it works.

**Create custom functions**

Write your own spreadsheet functions for calculations you repeat often.

Apps Script is not glamorous. That is why I like it. It sits close to the spreadsheets people already use and quietly removes annoying manual steps.
