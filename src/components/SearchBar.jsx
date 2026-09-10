import { SearchField, TextField } from "@adobe/react-spectrum";

function SearchBar({ nameQuery, familyQuery, onNameChange, onFamilyChange }) {
  return (
    <div className="grid gap-3 md:grid-cols-[1.7fr_1fr]">
      <SearchField label="Search models by name" value={nameQuery} onChange={onNameChange} />
      <TextField label="Search by family" value={familyQuery} onChange={onFamilyChange} />
    </div>
  );
}

export default SearchBar;
