export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 cursor-pointer">
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
        <p className="text-sm text-gray-600">{recipe.description}</p>
      </div>
      <div className="bg-gray-100 p-2 text-right">
        <button className="text-blue-500 font-medium">View Recipe</button>
      </div>
    </div>
  );
}
