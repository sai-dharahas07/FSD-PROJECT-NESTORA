Nestora – Real Estate Property Listing Application

Nestora is a simple, responsive real estate web app where users can browse
properties, filter them by location, price and type, save favourites and send
enquiries. It is built with **only HTML, CSS and JavaScript**. There are no
frameworks, no libraries and no build step.

## ✨ Features

- **Property listings:** cards with image, description, type and price, rendered dynamically from an array of objects using `forEach()`
- **Smart filters:** filter by location, maximum price and property type using `filter()`, updated as you type
- **Full CRUD:** add, update and delete property listings through a pop-up form
- **Favourites:** add or remove favourite properties with a heart icon, and view favourites only
- **Customer enquiry form:** choose a property and send your details, and enquiries are stored and listed
- **Form validation:** inline error messages for property and customer details
- **LocalStorage:** properties, favourites and enquiries persist after a page refresh
- **Location search API:** asynchronous city search using the free [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (no API key needed)
- **Loading and error states:** spinner while loading, with clear messages for no results or network errors
- **Responsive design:** works on desktop, tablet and mobile

## 🛠️ Tech Stack

| Technology | Used for |
|---|---|
| HTML5 | Page structure, forms and `<dialog>` pop-ups |
| CSS3 | Styling, Grid, Flexbox and responsive layout |
| JavaScript (ES6) | DOM updates, validation, CRUD and array methods |
| LocalStorage | Saving data in the browser |
| Fetch API + async/await | Calling the location API |

## 📁 Project Structure

```
real-estate-app/
├── index.html   # Page structure
├── style.css    # Design and layout
├── script.js    # App logic
└── README.md
```

## 🚀 How to Run

1. Clone or download this repository
   ```bash
   git clone https://github.com/<your-username>/nestora-real-estate-app.git
   ```
2. Open the folder and double-click **`index.html`** in your browser.
   (Optional: in VS Code, right-click `index.html` and choose **Open with Live Server**.)
3. Keep your internet connection on for property photos and location search.

## 🔍 How It Works

```
User action → Validate input → Update array → Save to LocalStorage → Re-render with forEach()
```

## ✅ Validation Rules

- Property name: at least 3 characters
- Price: greater than 0
- Property type: must be selected
- Email: valid format
- Phone: valid 10-digit mobile number
- Enquiry message: at least 10 characters

## 🔮 Future Improvements

- Backend database and user login
- Interactive map and image upload
- Sort, pagination and rent or sale option
- Email notifications for enquiries



## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Developed by Sai Dharahas Thatipamula
