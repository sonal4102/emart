import React, { useState, useEffect, useLayoutEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { NavLink } from "react-router-dom";
import "../App.css";

export function Products() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchFilter, setSearchFilter] = useState([]);
  const[searchBool, setSearchBool]=useState(false);
  let componentMounted = true;
  let counter = 0;
  const getData = () => {
    // calls an API and gets Data
    console.log("Fetching Data ..");
    const getProducts = async () => {
      //setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      if (componentMounted) {
        // setData(await response.clone().json());
        // setFilter(await response.json());
        // setLoading(false);
        // console.log(filter);
        //console.log( await response.clone().json());
        const searchData = await response.clone().json();
        //console.log(searchData);
        // searchData.filter((prod) => {
        //   return prod.title.contains(searchVal);
        // });
        let searchFilterData = searchData.filter((prod) => prod.title.toLowerCase().includes(searchVal.toLowerCase()));
        console.log(searchFilterData);
        setSearchFilter(searchFilterData);
        // searchData.map((prod) => {
        //   console.log(prod.title);
        // });
      }

      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  };

  const debounce = function (fn, d, value) {
    console.log(value);
    setSearchVal(value);
    console.log("Fetching Data1 ..");
    let timer;
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      getData();
    }, d);
    // return function () {
    //   let context = this,
    //     args = arguments;
    //   clearTimeout(timer);
    //   timer = setTimeout(() => {
    //     getData();
    //   }, d);
    // };
  };

  const betterFunction = (e) => {
    //  console.log(e.data);
    console.log(e.target.value);
    debounce(getData, 300, e.target.value);
  };
  const onSearch = (e) => {
     console.log("inside onSearch");
     setFilter(searchFilter);
     setSearchFilter([]);
     setSearchBool(true);
  };
   function onSearchSelect(a,b){
     console.log("inside onSearch");
      let searchFilterData = searchFilter.filter((prod) =>
        prod.title.toLowerCase().includes(b.toLowerCase())
      );
      console.log(searchFilterData);
     setFilter(searchFilterData);
     setSearchFilter([]);
     setSearchBool(false);
   };
  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      if (componentMounted) {
        setData(await response.clone().json());
        setFilter(await response.json());
        setLoading(false);
        console.log(filter);
      }

      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <h3>Loading...</h3>
      </>
    );
  };
  const filterProduct = (cat) => {
    const updatedList = data.filter((x) => x.category === cat);
    setFilter(updatedList);
  };
  const ShowProducts = () => {
    return (
      <>
        <div className="buttons d-flex justify-content-center mb-5 pb-5">
          <button
            className="btn btn-outline-dark me-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          <button
            className="btn btn-outline-dark me-2"
            onClick={() => filterProduct("men's clothing")}
          >
            Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark me-2"
            onClick={() => filterProduct("women's clothing")}
          >
            Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark me-2"
            onClick={() => filterProduct("jewelery")}
          >
            Jewelery
          </button>
          {/* <button
            className="btn btn-outline-dark me-2"
            onClick={() => filterProduct("electronics")}
          >
            Electronics
          </button> */}
        </div>

        {filter.map((product) => {
          return (
            <>
              <div className="col-md-3 mb-4">
                <div class="card h-100 text-center p-4" key={product.id}>
                  <img
                    src={product.image}
                    class="card-img-top"
                    alt={product.title}
                    height="250px"
                  />
                  <div class="card-body">
                    <h5 class="card-title mb-0">
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p class="card-text lead fw-bold">${product.price}</p>
                    <NavLink
                      to={`/products/${product.id}`}
                      className="btn btn-outline-dark"
                    >
                      Buy Now
                    </NavLink>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };
  return (
    <div>
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
            <hr />
          </div>
          {/* <div>
            <input
              type="text"
              value={searchVal}
              placeholder="Debouncing is used here"
              onChange={betterFunction}
            />
            <Select options={searchFilter.title} />
          </div> */}

          <div className="search-container " >
            <div className="search-inner">
              <input
                type="text"
                value={searchVal}
                placeholder="Debouncing is used here"
                onChange={betterFunction}
                className="search-inner-input"
              />
              <button className="searchClass"onClick={() => onSearch(searchVal)}> Search </button>
              {/* <button> Search </button> */}
            </div>
            <div className="dropdown">
              {(searchFilter.length>0 || !searchBool)?searchFilter.map((item) => (
                <div
                  onClick={() => onSearchSelect(searchVal, item.title)}
                  className="dropdown-row"
                  key={item.title}
                  type="button"
                >
                  {item.title}
                </div>
              )):"search result not found !"}
            </div>
          </div>

          <div className="row justify-content-center">
            {loading ? <Loading /> : <ShowProducts />}
          </div>
        </div>
      </div>
    </div>
  );
}