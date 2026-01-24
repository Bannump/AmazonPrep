# Amazon Interview Prep Dashboard

A comprehensive React + Tailwind CSS dashboard to track your Amazon interview preparation across DSA problems, Leadership Principles, and Low-Level Design.

## Features

### 1. DSA Section (LeetCode Tracker)
- **100+ LeetCode problems** pre-loaded with IDs, titles, and difficulty levels
- **Searchable and filterable** table by title, ID, difficulty, and status
- **Practice Timer**: Click "Practice" to open LeetCode in a new tab and start a background timer
- **Mark as Done**: Stop the timer, record time taken, and save your solution
- **Solution Storage**: Store your solutions for each problem in localStorage

### 2. Leadership Principles (Behavioral)
- **All 16 Amazon Leadership Principles** with descriptions
- **Expandable cards** for each principle
- **STAR Method** text areas (Situation, Task, Action, Result)
- **Status tracking**: No Story / Draft / Finalized
- **Persistent storage** of all your behavioral stories

### 3. Low-Level Design (LLD) Section
- **10 common Amazon LLD problems** (Parking Lot, Locker System, Vending Machine, etc.)
- **Resource links** for diagrams and documentation
- **Key Classes & Patterns** summary field
- **GitHub and Excalidraw** link storage

### 4. Additional Features
- **Global Progress Bar** showing % of DSA problems completed
- **Dark mode** design with Amazon-inspired colors (Zinc-900, Amber-500)
- **Responsive design** that works on all screen sizes
- **Data Persistence** using localStorage
- **Export/Import Backup** functionality to save and restore your data

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### DSA Problems
1. Use the search bar to find problems by title or ID
2. Filter by difficulty (Easy/Medium/Hard) or status (Todo/Done)
3. Click "Practice" to open LeetCode and start the timer
4. When done, click "Mark as Done" to stop the timer and save your solution
5. View your saved solutions anytime

### Leadership Principles
1. Click on any principle card to expand it
2. Read the description
3. Write your STAR method story in the text area
4. Set status to "Draft" or "Finalized"
5. All stories are automatically saved

### LLD Lab
1. Click "Add Details" on any LLD problem
2. Add resource links, key classes & patterns
3. Link to your GitHub repositories or Excalidraw diagrams
4. Save your work

### Backup & Restore
- Click "Export Backup" to download all your data as a JSON file
- Use "Import Backup" to restore your data from a previous export

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **localStorage** - Data persistence

## Data Structure

All data is stored in browser localStorage with the following keys:
- `amazon_prep_dsa_problems` - DSA problem status, solutions, and time taken
- `amazon_prep_leadership_principles` - STAR stories and status
- `amazon_prep_lld_problems` - LLD resources and notes
- `amazon_prep_active_timers` - Active practice timers

## Notes

- The timer continues running even when you switch tabs or navigate away
- All data persists across page refreshes
- Export your data regularly to avoid losing progress if you clear browser cache
- LeetCode URLs are auto-generated from problem titles

## License

MIT
