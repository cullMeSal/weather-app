import React, { useEffect, useState } from "react";
import './LocationSearchBar.css';

function LocationSearchBar({onLocationSelect}) {
  const API_KEY = `pk.ed9256414afd7dac6660d836ef619ce3`;

  const [query, setQuery] = useState("Hanoi");

  const fetchLocation = async (locationQuery)=> {
    const URL = `https://us1.locationiq.com/v1/search?key=${API_KEY}&format=json&q=${locationQuery}`

    let data = await fetch(URL)
    .then((e)=>e.json())
    
    if (data.error) alert("Unable to find location or location doesn't exist. Please try again.");
    else {
      console.log(data[0]);
      onLocationSelect(data[0]);
    }
  }

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      setQuery(document.getElementById("location-input").value)
    }
  };

  const handleSearch = async () => {
      setQuery(document.getElementById("location-input").value)
  };

  useEffect(()=>{
    // console.log("useEffect activated");
    fetchLocation(query)
  }, [query])

  return (
    <div className="location-search-bar">
      <input
        id="location-input"
        type="text"
        // onChange={handleChange}
        // onBlur={handleSelect}
        onKeyDown={handleKeyDown}
        // list="location-options"
        placeholder="Search for a location..."
      ></input>
      <img 
      id="button-search" 
      src="icons/icon_search.png" 
      alt="search icon"
      onClick={handleSearch}
      ></img>
      {/* <datalist id="location-options">
        {Array.isArray(suggestions) &&
          suggestions.map((place) => {
            return (
              <option key={place.place_id} value={place.display_name}></option>
            );
          })}
      </datalist> */}
    </div>
  );
}

export default LocationSearchBar;
