export const parseNumeric = (val, fieldName) => {
  const trimmed = typeof val === "string" ? val.trim() : val;
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (isNaN(num)) throw new Error(`${fieldName} must be a valid number`);
  return num;
};

export const checkRequiredFields = (fields, errorMsg = "Please fill in all required fields.") => {
  for (const field of fields) {
    if (!field || (typeof field === "string" && !field.trim())) {
      throw new Error(errorMsg);
    }
  }
};
