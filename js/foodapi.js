

// api address for fetching list of food items
const apiUrl = "https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel?offset=0&limit=2532&sprak=2"; // Adjust the limit as needed - limit is amount of items per pagedatabase entries is 2532


let db_fooditems = []; // Initialize an empty array to hold food items
const searchResultsContainer = document.getElementById("search-results");// Reference to the search results container

const mealList = document.getElementById("mealingredients02");

const nutritionValuesContainer = document.getElementById("nutritional-facts"); // Reference to the nutrition values container

let dbnutritionvalues = [];

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

function addingredienttomeal(listitem) {
    if (listitem == "") {
        return; // dont add empty items    
    }
    const mealitem = document.createElement("li"); // Create a new list item
    mealitem.classList.add("mealitem");
    mealitem.dataset.name = listitem.dataset.name; // Extract from dataset info and copy to new dataset
    mealitem.dataset.id = listitem.dataset.id; 
    mealitem.innerHTML = `<span class="ingredient-name">${listitem.dataset.name}</span>
                        <input type="range" class="ingredient-slider" min="0" max="200" value="0" step="1">
                        <span class="ingredient-weight">0g</span>
                        <button class="deletemealitem">Delete</button>`;
    mealitem.querySelector(".deletemealitem").addEventListener("click", () => mealList.removeChild(mealitem));
    mealitem.querySelector(".ingredient-slider").addEventListener("input", () => displaynutriationvalues(listitem.dataset.id, mealitem.querySelector(".ingredient-slider").value)), mealitem.querySelector(".ingredient-weight").textContent = mealitem.querySelector(".ingredient-slider").value + "g"; // Update the weight span when the slider value changes
    
    const infobutton = document.createElement("button"); // Create a more info button for the meal item
    infobutton.classList.add("showmoreinfo");
    infobutton.textContent = "More Info"; // Set the button text

    infobutton.addEventListener("click", () => displaynutriationvalues(listitem.dataset.id,), mealitem.querySelector(".ingredient-slider").value); // Add click event to display nutritional values
    mealitem.appendChild(infobutton); // Add the button to the meal item
    
    mealList.appendChild(mealitem); // Append the new list item to the meal list

}
async function getfoodnutriationvalues(id) {
    try {

        const response = await fetch("https://dataportal.livsmedelsverket.se/livsmedel/api/v1/livsmedel/"+id+"/naringsvarden?sprak=2"); // Fetch nutrition values for the specific food item
        if (!response.ok) {
            throw new Error("Failed to fetch nutrition values");
        }
        const data = await response.json();
        dbnutritionvalues = data || []; // Assign the fetched data to the global variable 
        console.log("Fetched food nutritional values:", dbnutritionvalues);
    } catch (error) {
        console.error("Error fetching nutritional values:", error);
        nutritionValuesContainer.innerHTML = `<p>Error fetching nutritional values. Please try again later.</p>`;
    }
}
function displaynutriationvalues(id, weight) {
    
    getfoodnutriationvalues(id)
    .then(() => {
    
    if (dbnutritionvalues.length === 0) {
        
        nutritionValuesContainer.innerHTML = "<p>No nutritional values found.</p>";
    }
    const scalemyingredient = weight/100; // Scale the ingredient weight to 100g

    const carbs = dbnutritionvalues.find(item => item.namn === "Carbohydrates, available") || "Carbohydrates not found."; // Find the item with the name "Kolhydrater"
    const scaledCarbs = carbs.varde * scalemyingredient; // Scale the value by the weight of the ingredient
    document.getElementById("carbs").textContent = (scaledCarbs).toFixed(2) + "g" || "not found"; // Display the value of "Kolhydrater" in grams
    document.getElementById("carbs-kcal").textContent = (scaledCarbs * 4).toFixed(2) || "not found";
    
    const protein = dbnutritionvalues.find(item => item.namn === "Protein") || "Protein not found."; // Find the item with the name "Protein"
    const protienscaled = protein.varde * scalemyingredient; // Scale the ingredient weight to 100g
    document.getElementById("protein").textContent = (protienscaled).toFixed(2) + "g" || "not found"; // Display the value of "Protein" in grams   
    document.getElementById("protein-kcal").textContent = (protienscaled * 4).toFixed(2) || "not found";
    
    const fat = dbnutritionvalues.find(item => item.namn === "Fat, total") || "Fat not found."; // Find the item with the name "Fat"
    const fatscaled = fat.varde * scalemyingredient; 
    document.getElementById("fat").textContent = (fatscaled).toFixed || "0g"; 
    document.getElementById("fat-kcal").textContent = ((fatscaled * 9)).toFixed(2) || "not found"; // Display the value of "Fat" in grams

    document.getElementById("total-kcal-enrichment").textContent = ((scaledCarbs * 4) + (protienscaled * 4) + (fatscaled * 9)).toFixed(2) || "Not found"; // Calculate and display the total kcal enrichment
    
    const totalKal = dbnutritionvalues.find(item => item.namn === "Energy (kcal)") || "Total energy not found."; // Find the item with the name "Total energy"
    const totalKalscaled = totalKal.varde * scalemyingredient; 
    document.getElementById("total-kcal-livsmedelsverket").textContent = (totalKalscaled).toFixed(2) + "kcal" || "not found"; // Display the value of "Total energy" in kcal
    })
    .catch(error => {
        console.error("Error displaying nutritional values:", error);
        nutritionValuesContainer.innerHTML = `<p>Error displaying nutritional values. Please try again later.</p>`;
    })
}


function displayusersearchresults(results) {
    searchResultsContainer.innerHTML = ""; // Clear previous search

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    const resultUl = document.createElement("ul"); // Create one <ul> for all results
    resultUl.classList.add("food-results-list");

    results.forEach(item => {
        const itemLi = document.createElement("li"); // Create an <li> for each item
        itemLi.classList.add("food-item");
        const itemName = item.namn || "Unknown Name";
        const itemId = item.nummer || "Unknown ID";
        itemLi.innerHTML = `
        <h3>${item.namn || "Unknown Name"}<span> ID: </span>${item.nummer || "Unknown ID"}</h3>`;
        itemLi.dataset.name = itemName  // store name and id as data to use later
        itemLi.dataset.id = itemId
        itemLi.addEventListener("click", () => { addingredienttomeal(itemLi); });

        resultUl.appendChild(itemLi);
    });

    searchResultsContainer.appendChild(resultUl);
}



function filterFoodItems(query) {
    return db_fooditems.filter(item =>
        item.namn && item.namn.toLowerCase().includes(query.toLowerCase())
    );
}

//Wont let you search until entire dom is loaded
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