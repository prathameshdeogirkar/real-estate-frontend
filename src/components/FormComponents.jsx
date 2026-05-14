export const ErrorBanner = ({ error }) => {
  if (!error) return null;
  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
      <p className="font-medium">{error}</p>
    </div>
  );
};

export const FormInput = ({ label, name, type = "text", placeholder, value, onChange, accept, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      accept={accept}
      className={`w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${type === "file" ? "bg-gray-50 cursor-pointer" : ""}`}
    />
  </div>
);

export const FormTextarea = ({ label, name, placeholder, value, onChange, rows = 4, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <textarea
      name={name}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
    />
  </div>
);

export const SubmitButton = ({ loading, loadingText, defaultText }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
      loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
    }`}
  >
    {loading ? loadingText : defaultText}
  </button>
);
