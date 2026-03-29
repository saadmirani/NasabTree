# Adding a New Family/Qasba to the Application

This guide explains all the changes needed to add a new family (Qasba) to the genealogy application. The process is designed to be systematic—if you follow all these steps, your new family will have all features working exactly like existing families.

## Overview of What Needs to Change

When you add a new family, you'll need to modify **4 main areas**:
1. **Data Files** (JSON genealogy data)
2. **Global Search** (globalSearch.js)
3. **Component & Routing** (JSX component + App.jsx)
4. **Menu Navigation** (SideMenu.jsx)

---

## Step-by-Step Instructions

### Step 1: Prepare Your Genealogy Data

**File Location:** `src/data/Nas[FamilyName].json`

**Example:** For "Qasba Kharbaiyya", the file is `src/data/Naskharbaiyya.json`

#### File Naming Convention
```
Nas + [FamilyKey] + .json
```

- **File name must start with `Nas`** (this is the convention)
- Use the exact same spelling as your `qasbaKey` (see Step 3)
- Examples: `Nasmiranbigha.json`, `Nassimla.json`, `Naskharbaiyya.json`

#### Data Structure
Your JSON file should follow this recursive tree structure:

```json
{
  "id": "p01",
  "name": "Founder Name",
  "gender": "male",
  "alive": false,
  "dob": "600 CE",
  "dod": "661 CE",
  "place": "City, Country",
  "about": "Biography or description of this person",
  "burial": {
    "place": "Burial location",
    "map": "https://geohack.toolforge.org/... (optional Google Maps link)"
  },
  "spouse": {
    "name": "Spouse Name",
    "fname": "Spouse's Father Name",
    "gender": "female",
    "alive": false,
    "dob": "Date or 'Not Known'",
    "dod": "Date or 'Not Known'",
    "place": "Location",
    "burial": {...},
    "about": "Spouse's biography"
  },
  "children": [
    {
      "id": "p02",
      "name": "Child Name",
      "gender": "male",
      ...
      "children": [
        { "id": "p03", ... }
      ]
    }
  ]
}
```

**Required Fields:**
- `id` - Unique ID (e.g., "p01", "p02", "p03" - must be unique within this file)
- `name` - Person's name
- `gender` - "male" or "female"
- `alive` - true or false
- `dob` - Date of birth
- `dod` - Date of death
- `place` - Location
- `about` - Biography or description
- `children` - Array of children (recursive)

**Optional Fields:**
- `spouse` - Spouse information (same structure as root)
- `burial` - Burial location with optional map URL

**Tip:** Use an existing file like `Nasmiranbigha.json` as a template and copy the structure.

---

### Step 2: Update globalSearch.js

**File Location:** `src/utils/globalSearch.js`

This file enables the global search feature. You need to:

#### 2a. Add Static Import

Add this import at the top of the file with other imports:

```javascript
import Nas[FamilyName] from "../data/Nas[FamilyName].json";
```

**Example for "Qasba Raja Babu":**
```javascript
import NasrajababuData from "../data/Nasrajababu.json";
```

**Current imports section (lines 4-11):**
```javascript
import Nasmiranbigha from "../data/Nasmiranbigha.json";
import Nassimla from "../data/Nassimla.json";
import Nasdeora from "../data/Nasdeora.json";
import Nasahmadpur from "../data/Nasahmadpur.json";
import Nasbikopur from "../data/Nasbikopur.json";
import Naskharbaiyya from "../data/Naskharbaiyya.json";
import Naspalasi from "../data/Naspalasi.json";
// ADD YOUR IMPORT HERE
```

#### 2b. Add to qasbaDataMap

Find the `qasbaDataMap` object (around line 13) and add your entry:

```javascript
const qasbaDataMap = {
   miranbigha: Nasmiranbigha,
   simla: Nassimla,
   deora: Nasdeora,
   ahmadpur: Nasahmadpur,
   bikopur: Nasbikopur,
   kharbaiyya: Naskharbaiyya,
   palasi: Naspalasi,
   // ADD YOUR ENTRY HERE
   rajababu: NasrajababuData,  // Example
};
```

**Rules:**
- Left side = `qasbaKey` (must match your component's key and URL parameter)
- Right side = The imported data variable
- Use lowercase for qasbaKey

#### 2c. Add to getAvailableQasbas()

Find the `getAvailableQasbas()` function (around line 35) and add your qasba:

```javascript
const getAvailableQasbas = () => {
   const qasbas = [
      { key: "miranbigha", name: "Qasba Miran Bigha" },
      { key: "simla", name: "Qasba Simla" },
      { key: "deora", name: "Qasba Deora" },
      { key: "bikopur", name: "Qasba Bikopur" },
      { key: "ahmadpur", name: "Qasba Ahmadpur" },
      { key: "kharbaiyya", name: "Qasba Kharbaiyya" },
      { key: "palasi", name: "Qasba Palasi" },
      // ADD YOUR QASBA HERE
      { key: "rajababu", name: "Qasba Raja Babu" },
   ];
   // ... rest of function
};
```

**Rules:**
- `key` = Must match qasbaDataMap key and your component's section name
- `name` = Display name shown in search results and menu

---

### Step 3: Create JSX Component

**File Location:** `src/components/Nasab[FamilyName].jsx`

**Example:** `src/components/NasabRajaBabu.jsx`

#### Option A: Copy from NasabMiranBigha.jsx (Recommended)

1. Copy `src/components/NasabMiranBigha.jsx`
2. Rename to `Nasab[FamilyName].jsx`
3. Replace these values in the copied file:

**Line ~16-17: Update QASBA_CONFIG**
```javascript
const QASBA_CONFIG = {
   qasbaName: "Qasba Raja Babu",  // Display name
   defaultFocusId: "p70",           // ID of founder (change if different)
   jsonData: NasrabjababuData        // Import your data!
};
```

**Line ~1: Add import for your data**
```javascript
import NasrajababuData from "../data/Nasrajababu.json";
import familyInfo from "../data/familyInfo/rajababu.json";  // If you have family info
```

**Line ~22: Export function name**
```javascript
export default function NasabRajaBabu({ setSection, focusPersonId }) {
```

#### The Key Parts That Work Automatically

These parts don't need changes—they'll work with your data:
- Tree rendering (uses QASBA_CONFIG.jsonData)
- Person search (searches QASBA_CONFIG.jsonData)
- Focus functionality (when clicked from global search)
- Statistics panel
- All tree interactions

---

### Step 4: Update App.jsx

**File Location:** `src/App.jsx`

#### 4a. Add Component Import

Add this import with other component imports (around line 8):

```javascript
import NasabRajaBabu from "./components/NasabRajaBabu";
```

**Current import section:**
```javascript
import NasabMiranBigha from "./components/NasabMiranBigha";
import NasabSimla from "./components/NasabSimla";
import NasabDeora from "./components/NasabDeora";
import Bikopur from "./components/bikopur";
import NasabAhmadpur from "./components/NasabAhmadpur";
import NasabKharbaiyya from "./components/NasabKharbaiyya";
import NasabPalasi from "./components/NasabPalasi";
// ADD YOUR IMPORT HERE
import NasabRajaBabu from "./components/NasabRajaBabu";
```

#### 4b. Add Routing in JSX

Find the main JSX section with all the section conditionals (around line 70) and add:

```javascript
{section === "rajababu" && <NasabRajaBabu setSection={handleSectionChange} focusPersonId={focusPersonId} />}
```

**Current routing section:**
```javascript
{section === "home" && <Home onPersonFound={handleSearchPersonFound} />}
{section === "miranbigha" && <NasabMiranBigha setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "simla" && <NasabSimla setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "deora" && <NasabDeora setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "bikopur" && <Bikopur setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "ahmadpur" && <NasabAhmadpur setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "kharbaiyya" && <NasabKharbaiyya setSection={handleSectionChange} focusPersonId={focusPersonId} />}
{section === "palasi" && <NasabPalasi setSection={handleSectionChange} focusPersonId={focusPersonId} />}
// ADD YOUR ROUTING HERE
{section === "rajababu" && <NasabRajaBabu setSection={handleSectionChange} focusPersonId={focusPersonId} />}
```

---

### Step 5: Update SideMenu.jsx

**File Location:** `src/components/SideMenu.jsx`

#### 5a. Update Active Section Check

Find the line that checks which sections are active (around line 29). This determines when the "Shajra-e-Saadaat" menu expands.

**Current:**
```javascript
className={`menu-item ${section === "miranbigha" || section === "simla" || section === "deora" ? "active" : ""}`}
```

**Updated (add your qasbaKey):**
```javascript
className={`menu-item ${section === "miranbigha" || section === "simla" || section === "deora" || section === "rajababu" ? "active" : ""}`}
```

#### 5b. Add Menu Item

Find the submenu section (around line 40) and add a new button:

```javascript
<button
   className={`submenu-item ${section === "rajababu" ? "active" : ""}`}
   onClick={() => setSection("rajababu")}
>
   <span className="icon"><NasabIcon /></span>
   <span className="label">Qasba Raja Babu</span>
</button>
```

Add this after the other family buttons in the submenu.

---

## Features That Will Work Automatically

Once you complete all 5 steps above, these features will work immediately:

✅ **Global Search** - Users can search people from your family
✅ **Search Navigation** - Clicking search results zooms to that person
✅ **Tree Visualization** - Interactive D3 family tree rendering
✅ **Person Details** - Click any person to see biographical info
✅ **Ancestry Chain** - See lineage from person to founder
✅ **Statistics Panel** - View family statistics
✅ **URL Parameters** - `?person=p01&qasba=rajababu` works
✅ **Menu Navigation** - Family appears in side menu
✅ **Focus on Load** - Tree focuses automatically when navigating from search
✅ **Responsive Design** - Mobile-friendly layout

---

## Example: Adding "Qasba Raja Babu"

Let's trace through a complete example:

### 1. Data File
Create: `src/data/Nasrajababu.json`

### 2. globalSearch.js
```javascript
// Add import
import NasrajababuData from "../data/Nasrajababu.json";

// Add to map
const qasbaDataMap = {
   // ... existing entries
   rajababu: NasrajababuData,
};

// Add to list
const qasbas = [
   // ... existing entries
   { key: "rajababu", name: "Qasba Raja Babu" },
];
```

### 3. Component
Create: `src/components/NasabRajaBabu.jsx`
```javascript
import NasrajababuData from "../data/Nasrajababu.json";

const QASBA_CONFIG = {
   qasbaName: "Qasba Raja Babu",
   defaultFocusId: "p01",
   jsonData: NasrajababuData
};

export default function NasabRajaBabu({ setSection, focusPersonId }) {
   // ...rest of component (same as MiranBigha)
}
```

### 4. App.jsx
```javascript
import NasabRajaBabu from "./components/NasabRajaBabu";

// In routing:
{section === "rajababu" && <NasabRajaBabu setSection={handleSectionChange} focusPersonId={focusPersonId} />}
```

### 5. SideMenu.jsx
```javascript
// Update active check
section === "miranbigha" || section === "simla" || section === "deora" || section === "rajababu"

// Add button in submenu
<button onClick={() => setSection("rajababu")}>
   <span className="icon"><NasabIcon /></span>
   <span className="label">Qasba Raja Babu</span>
</button>
```

---

## Optional: Family Info JSON

If you want the family info popup (shows family history):

1. Create: `src/data/familyInfo/rajababu.json`
2. Copy structure from existing family info files
3. Import in your component:
   ```javascript
   import familyInfo from "../data/familyInfo/rajababu.json";
   ```

---

## Testing Your New Family

1. **Run dev server:** `npm run dev`
2. **Check search:** Search for a person from your family
3. **Click result:** Should navigate to your Qasba and focus on that person
4. **Test menu:** New family should appear in side menu
5. **Test URL:** Navigate to `?person=p01&qasba=rajababu` - should load correctly
6. **Build test:** `npm run build` - should succeed with no errors

---

## Summary Checklist

- [ ] Created `src/data/Nas[FamilyName].json` with genealogy data
- [ ] Added import to `src/utils/globalSearch.js`
- [ ] Added entry to `qasbaDataMap` in `globalSearch.js`
- [ ] Added entry to `getAvailableQasbas()` in `globalSearch.js`
- [ ] Created `src/components/Nasab[FamilyName].jsx` component
- [ ] Added import in `src/App.jsx`
- [ ] Added routing in `src/App.jsx` JSX section
- [ ] Updated active check in `src/components/SideMenu.jsx`
- [ ] Added menu button in `src/components/SideMenu.jsx`
- [ ] Tested search functionality
- [ ] Tested menu navigation
- [ ] Tested URL parameters
- [ ] Built successfully with `npm run build`

---

## Troubleshooting

### Search returns no results
- Check that `qasbaKey` in globalSearch.js matches the key in getAvailableQasbas()
- Verify JSON data has correct `id` and `name` fields
- Make sure person names contain the search query

### Tree doesn't render
- Check QASBA_CONFIG.jsonData points to correct import
- Verify JSON data structure matches expected format
- Check browser console for errors

### Navigation doesn't work
- Ensure section name in App.jsx routing matches qasbaKey
- Check component props are passed: `setSection={handleSectionChange} focusPersonId={focusPersonId}`
- Verify SideMenu onClick calls correct section name

### Build fails
- Check all imports are correct paths
- Verify no typos in file names (case-sensitive!)
- Ensure JSON files are valid (use JSON validator if unsure)

---

## Questions?

Refer to existing families (Miran Bigha, Simla, etc.) for working examples. All structure follows the same pattern.
