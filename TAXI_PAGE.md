# Taxi Quote Form Wireframe

## Overall Direction

The taxi quote form should feel guided, simple, and modern.

We will use:
- A white page background
- Dark navy headings and structure
- Dark red accents for active progress, buttons, and highlights
- A 3-step form flow
- A clear progress bar across the top
- A clean, single-column form on mobile
- A helpful side panel on desktop if needed later

The form should avoid overwhelming the user. We want to collect the details the office actually needs while keeping the experience straightforward.

---

## Form Steps

1. Your details
2. Taxi details
3. Insurance details

---

## Progress Bar

### Goal
Show the user where they are in the form and how much is left.

### Style
- Horizontal progress steps at the top of the page
- Active step highlighted in dark red
- Inactive steps shown in muted navy/grey
- Thin connecting line between steps

### Step Labels
- Your details
- Taxi details
- Insurance details

---

## Page Intro

### Heading
Taxi insurance quote

### Supporting text
Tell us a few details and our team will review your enquiry and get in touch.

### Notes
- Keep this short
- The page should feel clear and practical, not too wordy

---

# Step 1: Your Details

## Goal
Collect the user’s personal and contact information first, and guide them through address lookup in a simple way.

## Section Heading
Your details

## Helper text
Tell us who you are and how we can reach you.

## Fields
- Full name
- Phone number
- Email
- Date of birth
- House number / name
- Postcode
- Find address button

---

## Address Lookup Flow

### Why we are using this
Address lookup keeps the form quicker to complete and feels more polished than forcing users to type their full address manually.

### Recommended UX
The address lookup should happen inside Step 1 rather than as a separate full page.

### Flow
1. User enters:
   - House number / name
   - Postcode
2. User clicks:
   - Find address
3. If an address is found:
   - Show a neat address confirmation box below
   - Give the user the option to confirm it
4. If the address is wrong:
   - Let the user choose a manual entry option

### Recommended UI
After clicking `Find address`, show one of the following:

#### Option A: Address confirmation box
Example:
- 443 Wilbraham Road
- Manchester
- M21 0UZ

Actions:
- Use this address
- Enter address manually

This is the recommended option.

#### Option B: Address dropdown
If multiple addresses are found, show a dropdown list of matching addresses and let the user choose one.

---

## Manual Address Entry Fallback

### If lookup fails or user prefers manual entry
Show:
- Address line 1
- Address line 2
- Town / city
- County (optional)
- Postcode

### Trigger
Manual fields should only appear if:
- the user clicks `Enter address manually`
- or no address match is found

---

## Step 1 Input Types
- Full name: text
- Phone number: tel
- Email: email
- Date of birth: date
- House number / name: text
- Postcode: text
- Find address: button

---

## Step 1 Notes
- Start with the easiest fields to build momentum
- Keep the layout simple
- Avoid showing too many address fields unless needed
- Use address lookup as the main path
- Keep manual entry as backup

---

# Step 2: Taxi Details

## Goal
Collect taxi-specific details that help the office understand the enquiry properly.

## Section Heading
Taxi details

## Helper text
Tell us about your vehicle and licensing details.

## Fields
- Vehicle registration
- Taxi type
- Council / licensing authority
- UK licence type
- Licence number

---

## Licensing Authority Field

### Recommended approach
Use a searchable dropdown plus an `Other` option.

### Why
A searchable list will be easier than a long hard-to-scan dropdown, but we do not need to overcomplicate the first build with a perfect UK-wide authority database.

### Behaviour
- User searches or selects an authority
- Include common authorities first if helpful
- Include `Other licensing authority`
- If `Other` is selected, show a text field:
  - Enter your licensing authority

### Notes
This is the recommended version for V1.

---

## Step 2 Input Types
- Vehicle registration: text
- Taxi type: select
- Council / licensing authority: searchable select
- UK licence type: select
- Licence number: text

### Possible Taxi Type Options
- Private hire
- Public hire
- Executive
- Other

### Possible UK Licence Type Options
- Full UK licence
- EU licence
- Other

---

# Step 3: Insurance Details

## Goal
Collect the details the office team actually needs to review the quote enquiry properly.

## Section Heading
Insurance details

## Helper text
Tell us about your current insurance and any important details we should know.

## Fields
- No claims bonus
- Current insurer
- Current premium
- Target premium
- Claims or convictions
- Extra notes
- Privacy notice / consent checkbox

---

## Claims Or Convictions

### Recommended UX
Start with a simple yes/no question:
- Yes
- No

If the user selects `Yes`, show:
- A text area for brief details

This keeps the form cleaner for most users.

---

## No Claims Bonus

### Recommended UX
Use a select dropdown rather than free text.

### Options
- 0 years
- 1 year
- 2 years
- 3 years
- 4 years
- 5+ years

---

## Step 3 Input Types
- No claims bonus: select
- Current insurer: text
- Current premium: text or number
- Target premium: text or number
- Claims or convictions: yes/no
- Extra notes: textarea
- Privacy checkbox: checkbox

---

## Privacy Notice Checkbox

### Suggested wording
I agree to Apple Insurance Services using my information to review my enquiry and contact me about it.

### Notes
- Keep the full Privacy Notice linked nearby
- This checkbox should be required before submission

---

# Right-Hand Information Panel

## Goal
Reassure the user and explain what happens next.

## Recommended content

### Before you begin
Please complete the form with accurate details so our team can review your enquiry properly.

### What happens next
Once you submit your enquiry, a member of our team will review your details and contact you to discuss your quote.

### Privacy
We only use your information to review your enquiry and contact you about it. Full details will be available in our Privacy Notice.

### Optional direct contact line
Prefer to speak to someone directly? Call 0161 881 2139.

---

# Buttons And Navigation

## Step 1
- Continue

## Step 2
- Back
- Continue

## Step 3
- Back
- Submit quote request

## Notes
- Continue / Submit should be the main button
- Back should be secondary
- Keep buttons large and easy to tap

---

# Mobile Behaviour

## Rules
- Single-column form layout
- Large tap targets
- Clear labels
- Good spacing between fields
- Progress tracker simplified if necessary
- Side information panel stacks below the form

## Notes
Mobile usability is very important because many users may complete the form on their phones.

---

# Build Order

1. Create the taxi quote page layout
2. Add the progress bar
3. Build Step 1 fields
4. Add the address lookup UI flow with a placeholder confirmation box
5. Build Step 2
6. Build Step 3
7. Add validation
8. Add real postcode/address lookup later
9. Add backend form submission after the frontend flow feels right

---

# Final Recommendation

The taxi quote form should use:
- A 3-step flow
- A white page layout
- Dark navy and dark red accents
- Address lookup inside Step 1
- Searchable licensing authority field with `Other`
- Clear next/back actions
- A simple and practical structure that fits the real office workflow
