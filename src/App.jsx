import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SearchByName from './pages/SearchByName';
import SearchByRack from './pages/SearchByRack';
import SearchByBarcode from './pages/SearchByBarcode';
import AddRack from './pages/AddRack';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search-name" element={<SearchByName />} />
          <Route path="search-rack" element={<SearchByRack />} />
          <Route path="search-barcode" element={<SearchByBarcode />} />
          <Route path="add-rack" element={<AddRack />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
