export default function Filters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Range Filter: Cooking Time */}
      <div>
        <label className="block font-medium mb-1">Cooking Time</label>
        <input type="range" min="0" max="120" step="5" className="w-full" />
      </div>

      {/* Number of Ingredients */}
      <div>
        <label className="block font-medium mb-1">Number of Ingredients</label>
        <input
          type="number"
          min="1"
          max="20"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Dietary Filters */}
      <div>
        <label className="block font-medium mb-1">Dietary Preferences</label>
        <select className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Any</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>

      {/* Recipe Type */}
      <div>
        <label className="block font-medium mb-1">Meal Type</label>
        <select className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Any</option>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
          <option value="appetizers">Appetizers</option>
          <option value="dessert">Dessert</option>
        </select>
      </div>

      {/* Cuisine Type */}
      <div>
        <label className="block font-medium mb-1">Cuisine Type</label>
        <select className="w-full p-2 border border-gray-300 rounded-lg">
          <option value="">Any</option>
          <option value="pizza">Pizza</option>
          <option value="pasta">Pasta</option>
          <option value="seafood">Seafood</option>
          <option value="soup">Soup</option>
          <option value="salad">Salad</option>
        </select>
      </div>

      {/* Meal Prep Friendly */}
      <div>
        <label className="block font-medium mb-1">Meal Prep Friendly</label>
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>

      {/* Freezable Recipes */}
      <div>
        <label className="block font-medium mb-1">Freezable Recipes</label>
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>
    </div>
  );
}
