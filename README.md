#  Nestora – Real Estate Property Listing Application

Nestora is a simple, responsive real estate web app where users can browse properties, filter them by location, price and type, save favourites and send enquiries. It is built with **HTML, CSS and JavaScript**. There are no frameworks, no libraries and no build step.

# Features

- **Property listings:** Cards with image, description, type and price, rendered dynamically from an array of objects using `forEach()`.
- **Smart filters:** Filter by location, maximum price and property type using `filter()`, updated as you type.
- **Full CRUD:** Add, update and delete property listings through a pop-up form.
- **Favourites:** Add or remove favourite properties with a heart icon, and view favourites only.
- **Customer enquiry form:** Choose a property and send your details, and enquiries are stored and listed.
- **Form validation:** Inline error messages for property and customer details.
- **LocalStorage:** Properties, favourites and enquiries persist after a page refresh.
- **Location search API:** Asynchronous city search using the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (no API key needed).
- **Loading and error states:** Spinner while loading, with clear messages for no results or network errors.
- **Responsive design:** Works on desktop, tablet and mobile.

# Tech Stack

| Technology              | Used for                                        |
| ----------------------- | ----------------------------------------------- |
| HTML5                   | Page structure, forms and `<dialog>` pop-ups    |
| CSS3                    | Styling, Grid, Flexbox and responsive layout    |
| JavaScript (ES6)        | DOM updates, validation, CRUD and array methods |
| LocalStorage            | Saving data in the browser                      |
| Fetch API + async/await | Calling the location API                        |

# Project Structure

```text
real-estate-app/
├── index.html   # Page structure
├── style.css    # Design and layout
├── script.js    # App logic
└── README.md
```

# How to Run

1. Clone or download this repository.

   ```bash
   git clone https://github.com/<your-username>/nestora-real-estate-app.git
   ```

2. Open the folder and double-click **`index.html`** in your browser.

   (Optional: In VS Code, right-click `index.html` and choose **Open with Live Server**.)

3. Keep your internet connection on for property photos and location search.

# 🔍 How It Works

```text
User action → Validate input → Update array → Save to LocalStorage → Re-render with forEach()
```

#  Validation Rules

- Property name: At least 3 characters.
- Price: Greater than 0.
- Property type: Must be selected.
- Email: Valid format.
- Phone: Valid 10-digit mobile number.
- Enquiry message: At least 10 characters.

# 🔮 Future Improvements

- Backend database and user login.
- Interactive map and image upload.
- Sort, pagination and rent or sale option.
- Email notifications for enquiries.

---

**Developed by Sai Dharahas Thatipamula.**
