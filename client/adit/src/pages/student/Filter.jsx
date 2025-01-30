import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data science", label: "Data Science" },
  { id: "frontend development", label: "Frontend Development" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "mern stack development", label: "MERN Stack Development" },
  { id: "backend development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {  //get handlefilterChange as Props, now we hve only set category & Price idide this
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => { //handle category Change
    

    // prevCategories is not explicitly declared anywhere because it's actually being passed automatically by React's useState hook in the callback function.

    // When you pass a function to setSelectedCategories, React automatically provides 
    // the current value of the state (in this case, selectedCategories) as the argument to that function.
// This argument is what you're referring to as prevCategories in your callback
    setSelectedCategories((prevCategories) => { //prevcategories
      const newCategories = prevCategories.includes(categoryId) //prevcategories m we checkis it include that id or not , so if it seleted we unslect it using filter
        ? prevCategories.filter((id) => id !== categoryId)  //wo chahoye jo id!= categoryId
        : [...prevCategories, categoryId];  //otherwise if not exists we add that category

        handleFilterChange(newCategories, sortByPrice);
        return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  }
  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;


/*
Explanation of Key Parts:
State Initialization:

selectedCategories: This state stores the categories that the user selects. Initially, it's an empty array [] because no category is selected at the start.
sortByPrice: This state stores the value of the selected price sorting option (either "low" or "high"). It's also initially set to an empty string.
handleCategoryChange Function:

This function is triggered when a user clicks on a checkbox to select or deselect a category.
Inside setSelectedCategories, it updates the selectedCategories state based on whether the categoryId is already in the list of selected categories:
If the category is already selected (i.e., prevCategories.includes(categoryId) returns true), it removes that category from the list (prevCategories.filter((id) => id !== categoryId)).
If the category is not selected (i.e., categoryId is not in prevCategories), it adds the category to the list ([...prevCategories, categoryId]).
After updating the state, it calls the handleFilterChange function (which is passed as a prop to the Filter component) with the updated list of selectedCategories and the current sortByPrice state.
Price Sorting (selectByPriceHandler):

This function handles sorting by price when the user selects an option from the "Sort by price" dropdown.
It updates the sortByPrice state with the selected value (either "low" or "high") and calls handleFilterChange with the current selectedCategories and the updated price sorting option.
Rendering the Filter UI:

The Filter component renders a "Sort by" dropdown and a list of categories with checkboxes.
For each category in the categories array, it renders a Checkbox component and a Label component, with an onCheckedChange event that triggers the handleCategoryChange function when the checkbox is checked or unchecked.

*/