/* day selector and adding removing from lists, global  */

let activeDay = '';

// Reference the label for the currently selected day
const currentDayLabel = document.querySelector('.currentdayselected');


function setActiveDay(day) {
    activeDay = day;
    currentDayLabel.textContent = `Selected Day: ${day}`;
    currentDayLabel.setAttribute('value', day);

    
    const dayButtons = document.querySelectorAll('.dayofweek');
    dayButtons.forEach(button => button.classList.remove('active')); 
    const activeButton = Array.from(dayButtons).find(button => button.value === day);
    if (activeButton) {
        activeButton.classList.add('active'); 
    }
}

function addMealToActiveDay(meal) {
    if (activeDay) {
        const mealList = document.getElementById(`${activeDay}-meals`);
        const mealItem = document.createElement('li');
        mealItem.textContent = meal;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => mealList.removeChild(mealItem);
        mealItem.appendChild(deleteButton);
        mealList.appendChild(mealItem);
    } else {
        alert('Please select a day first.');
    }
}

const dayButtons = document.querySelectorAll('.dayofweek'); // Select all buttons with the class 'dayofweek'

dayButtons.forEach(button => {
    button.addEventListener('click', () => {
        setActiveDay(button.value); // Use the button's value attribute
    });
});
