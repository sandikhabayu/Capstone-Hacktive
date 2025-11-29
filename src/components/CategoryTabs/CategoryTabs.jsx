import React from 'react';
import { NavLink } from 'react-router-dom';
import './CategoryTabs.css';

const CategoryTabs = () => {
  return (
    <div className="category-tabs">
      <NavLink to="/" className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>All News</NavLink>
      <NavLink to="/indonesia" className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>Indonesia</NavLink>
      <NavLink to="/technology" className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>Technology</NavLink>
      <NavLink to="/health" className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>Health</NavLink>
      <NavLink to="/saved" className={({ isActive }) => isActive ? "tab-item active" : "tab-item"}>Saved</NavLink>
    </div>
  );
};

export default CategoryTabs;