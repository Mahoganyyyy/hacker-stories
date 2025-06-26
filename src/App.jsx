import { useCallback, useEffect, useReducer, useState } from 'react'
import './App.css'
import axios from 'axios'

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
};

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
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, {data: [], isLoading: false, isError: false});

  const handleFetchStories = useCallback(async () => {
    if (!searchTerm) return;  

    dispatchStories({type: "STORIES_FETCH_INIT"});

    try{
    const result = await axios.get(url);

    dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits
      });
    } catch{
      dispatchStories({type: "STORIES_FETCH_FAILURE"})
    }
  }, [url]) // A change of searchTerm will update the callback, but not run it. 

  useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories]) // When the callback changes, run it via useEffect. 

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const searchAction = (e) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  const handleRemoveStory = (item) => {
    dispatchStories({type: "REMOVE_STORY", payload: item});
  }

  return (
    <>
      <h1>My Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} searchAction={searchAction} />

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </>
)};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  searchAction
}) => (
      <form action={searchAction}>
        <InputWithLabel id="search" label="Search" onInputChange={onSearchInput} value={searchTerm}>
          <strong>Search: </strong>
        </InputWithLabel>

        <button disabled={!searchTerm} type="submit">
          Submit
        </button>
      </form>
)

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
