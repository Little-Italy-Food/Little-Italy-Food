import { MicrophoneIcon, SearchIcon } from "@heroicons/react/solid";

export default function SearchBar() {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="Search recipes..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
      />
      <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        <SearchIcon className="h-5 w-5" />
      </button>
      <button className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300">
        <MicrophoneIcon className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}
