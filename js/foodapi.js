

// api address for fetching list of food items
const apiUrl = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel?offset=0&limit=2532&sprak=2"; // Adjust the limit as needed - limit is amount of items per pagedatabase entries is 2532
const emptyapiURL = ""; // to use along side with item.links.0.href

let db_fooditems = []; // Initialize an empty array to hold food items

const searchResultsContainer = document.getElementById("search-results"); // Reference to the search results container

async function fetchFoodItems() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch food items");
        }
        const data = await response.json();
        db_fooditems = data.livsmedel || []; // Assign 'livsmedel' to array 
        console.log("Fetched food items:", db_fooditems);
    } catch (error) {
        console.error("Error fetching food items:", error);
        searchResultsContainer.innerHTML = `<p>Error fetching food items. Please try again later.</p>`;
    }
}



function displayusersearchresults(results) {
    searchResultsContainer.innerHTML = ""; // Clear previous search

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";  /* this is where we have problems */
        return;
    }

    const resultUl = document.createElement("ul"); // Create one <ul> for all results
    resultUl.classList.add("food-results-list");

    results.forEach(item => {
        const itemLi = document.createElement("li"); // Create an <li> for each item
        itemLi.classList.add("food-item");
        itemLi.innerHTML = `
        <h3>${item.namn || "Unknown Name"}<span>, ID: </span>${item.nummer || "Unknown ID"}</h3>
        <p>Type: ${item.livsmedelsTyp || "Unknown Type"}</p>
        
        
        `;
        resultUl.appendChild(itemLi);
    });

    searchResultsContainer.appendChild(resultUl);
}



function filterFoodItems(query) {
    return db_fooditems.filter(item =>
        item.namn && item.namn.toLowerCase().includes(query.toLowerCase())
    );
}


document.addEventListener("DOMContentLoaded", () => {
    
    const searchInput = document.getElementById("ingredientsearchinput"); /* so we dont get a null referance */

    // Event listener for ingredients search input
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        if (query.length === 0) {
            searchResultsContainer.innerHTML = ""; // Clear results if input is empty
            return;
        }
        const filteredResults = filterFoodItems(query);


        displayusersearchresults(filteredResults);
    });
});



fetchFoodItems(); // Fetch food items when the script loads