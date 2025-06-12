import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {

  const stories = [
    {
      title: "React",
      url: "https://react.dev",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: "Redux",
      url: "https://redux.js.org",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1
    },
  ];


  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search />

      <hr />

      <List list={stories} />

    </div>
)};


const Search = () => { 
  const handleChange = (event) => {
    console.log("Change");
    console.log(event);
    console.log(event.target.value);
  };

  const handleBlur = (event) => {
    console.log("Blur");
    console.log(event);
    console.log(event.target.value);
  };
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onBlur={handleBlur} onChange={handleChange} />
    </div>
  )
};

const List = (props) => (
  <ul>
    {props.list.map((item) => 
      <Item key={item.objectID} listItem={item} />
    )}
  </ul>
);

const Item = (props) => (
      <li>
        <span>
          <a href={props.listItem.url} target='blank'>{props.listItem.title} </a>
        </span>
        <span>{props.listItem.author} </span>
        <span>{props.listItem.num_comments} </span>
        <span>{props.listItem.points} </span>
      </li>
);

export default App
