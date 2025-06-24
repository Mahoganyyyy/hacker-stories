import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const App = () => {
  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("search") || ""
  );

  useEffect(() => {
    localStorage.setItem("search", event.target.value);
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

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

      <Search onSearch={handleSearch} search={searchTerm} />

      <hr />

      <List list={stories.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))} />

    </div>
)};


const Search = ({onSearch, search}) => { 
  const handleBlur = (event) => {
    console.log("Blur");
    console.log(event);
    console.log(event.target.value);
  };
  
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input value={search} id="search" type="text" onBlur={handleBlur} onChange={onSearch} />
    </div>
  )
};

const List = ({list}) => (
  <ul>
    {list.map(({ objectID, ...item}) => 
      <Item key={objectID} {...item} />
    )}
  </ul>
);

const Item = ({title, url, author, num_comments, points}) => (
      <li>
        <span>
          <a href={url} target='blank'>{title} </a>
        </span>
        <span>{author} </span>
        <span>{num_comments} </span>
        <span>{points} </span>
      </li>
);

export default App
