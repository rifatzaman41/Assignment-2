const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const cartBtn = document.getElementById('cart-btn');
const cartItems = document.getElementById('cart-items');
const clearCartBtn = document.getElementById('clear-cart-btn');
let cart = [];

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});
clearCartBtn.addEventListener('click', clearCart);

// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                            <button class="add-to-cart-btn btn btn-success">Add to Cart</button>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}

function handleMealClick(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe-btn')) {
      let mealItem = e.target.parentElement.parentElement;
      fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
      .then(response => response.json())
      .then(data => mealRecipeModal(data.meals));
  } else if (e.target.classList.contains('add-to-cart-btn')) {
      let mealItem = e.target.parentElement.parentElement;
      addToCart(mealItem.dataset.id);
  }
}



// get recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// create a modal
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

    
// Add meal to the cart
function addToCart(meal) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
  .then(response => response.json())
  .then(data => {
      const meal = data.meals[0];
      const mealExists = cart.find(item => item.idMeal === mealItem.dataset.id);
      if (!mealExists) {
          cart.push(meal);
          updateCartDisplay();
      }
  });
}


// Update cart display and count
function updateCartDisplay() {
  let html = '';
  let totalQuantity = 0;
  cart.forEach(meal => {
      html += `
        totalQuantity = totalQuantity + item.quantity;
          <div class="cart-item" data-id="${meal.idMeal}">
              <div class="cart-item-img">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              </div>
              <div class="cart-item-details">
                  <h4>${meal.strMeal}</h4>
                  <button class="remove-from-cart-btn btn btn-danger">Remove</button>
              </div>
          </div>
      `;
  });

  // Update cart content and count
  cartItems.innerHTML = html;
  document.getElementById('cart-count').innerText = cart.length;

  // Add event listener for removing items
  document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
      button.addEventListener('click', removeFromCart);
  });
}

// Remove item from cart
function removeFromCart(e) {
  const mealId = e.target.closest('.cart-item').dataset.id;
  cart = cart.filter(meal => meal.idMeal !== mealId);
  updateCartDisplay();
}

// Clear cart function
function clearCart() {
  cart = [];
  updateCartDisplay();
}







