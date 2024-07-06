import { useState } from "react";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";

import axios from "axios";
import request from "../../services/requests";

import SearchResult from "./SearchResult";

axios.defaults.baseURL = "http://localhost:8080/";

const SearchBar = ({ onSelectAttendant }) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const fetchData = async (value) => {
    try {
      const response = await axios.get(request.getUsers);
      const data = response.data.data;

      const filteredData = data.filter((user) => {
        return (
          value &&
          user &&
          user.Name &&
          user.Name.toLowerCase().includes(value.toLowerCase())
        );
      });

      setResults(filteredData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSelectAttendant = (user) => {
    onSelectAttendant(user.Name);
    setInput("");
    setResults([]);
  };

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="w-full">
      <div className="flex w-full">
        <TextField
          id="search-bar"
          className="text"
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="search"
                onClick={() => fetchData(input)}
                edge="end"
              >
                <SearchIcon className="text-blue-500" />
              </IconButton>
            ),
          }}
          style={{ flex: 1 }}
        />
      </div>
      {results.map((user) => (
        <MenuItem
          key={user.UserID}
          onMouseOver={() => console.log("Hovered over", user.Name)}
        >
          <SearchResult
            user={user}
            onSelect={() => handleSelectAttendant(user)}
          />
        </MenuItem>
      ))}
    </div>
  );
};

export default SearchBar;
