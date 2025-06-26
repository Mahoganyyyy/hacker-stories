import { useEffect, useReducer, useState } from 'react'
import './App.css'

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

const initialStories = [
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

const getAsyncStories = () => 
  new Promise((resolve, reject) => 
    setTimeout(
      () => resolve({data: { stories: initialStories}}),
      2000
    )
);

const storiesReducer = (state, action) => {
  switch(action.type){
    case "STORIES_FETCH_INIT": {
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    }
    case "STORIES_FETCH_SUCCESS": {
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      }
    }
    case "STORIES_FETCH_FAILURE": {
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    }
    case "REMOVE_STORY": {
      return {
        ...state,
        data: state.data.filter(
        (story) => action.payload.objectID !== story.objectID
      )};
    }
    default: {
      throw new Error();
    }
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState('search', '');
  const [stories, dispatchStories] = useReducer(storiesReducer, {data: [], isLoading: false, isError: false});

  useEffect(() => {
    dispatchStories({type: "STORIES_FETCH_INIT"});

    getAsyncStories().then(result => {
      dispatchStories({type: "STORIES_FETCH_SUCCESS", payload: result.data.stories});
    })
    .catch(() => dispatchStories({type: "STORIES_FETCH_FAILURE"})) 
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStory = (item) => {
    dispatchStories({type: "REMOVE_STORY", payload: item});
  }

  return (
    <>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" label="Search" onInputChange={handleSearch} value={searchTerm}>
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
      <List list={stories.data.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))} onRemoveItem={handleRemoveStory} />
      )}
    </>
)};


const InputWithLabel = ({ id, value, type="text", onInputChange, children }) => {   
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input value={value} id={id} type={type} onChange={onInputChange} />
    </>
  )
};

const List = ({list, onRemoveItem}) => (
  <ul>
    {list.map((item) => 
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    )}
  </ul>
);

const Item = ({item, onRemoveItem}) => (
    <li>
      <span>
        <a href={item.url} target='blank'>{item.title} </a>
      </span>
      <span>{item.author} </span>
      <span>{item.num_comments} </span>
      <span>{item.points} </span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  );
  

export default App
