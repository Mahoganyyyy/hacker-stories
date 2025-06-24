import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, key];
};

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

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

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
