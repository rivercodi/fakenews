import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'lalala',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

var url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

function isSearched(searchTerm){
  return function(item){
    //condition that returns true or false
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()); 
  }
}

class App extends Component {
  constructor(props){
    super(props); 

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
    }

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories= this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this); 
    this.onSearchChange = this.onSearchChange.bind(this); 
  }

  setSearchTopStories(result){
    this.setState({result}); 
  }

  fetchSearchTopStories(searchTerm){
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
  }

  componentDidMount(){
    const {searchTerm} = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onDismiss(id){
    function isNotId(item){
      return item.objectID !== id;
    }

    const updatedList = this.state.list.filter(isNotId); 

    this.setState({list: updatedList}); 
  }


  onSearchChange(e){
    this.setState({searchTerm: e.target.value})
  }

  render() {
    const { searchTerm, result} = this.state; 
    if(!result) {return null;}
    return (
      <div className="page">
      <div className="interactions">
      <Search 
      value={searchTerm} 
      onChange={this.onSearchChange}
      > Search

      </Search> 
      </div>

      <Table 
      list={result.hits}  
      onDismiss={this.onDismiss}
      pattern={searchTerm}
      /> 
      </div>
    );
  }
}

const Search = ({value, onChange, children}) => {
  return(
    <form> 
    {children}<input 
    type="text"
    value={value}
    onChange={onChange}
    /> 
    </form> 
  )
}

const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
    { list.filter(isSearched(pattern)).map(item =>
    <div key={item.objectID} className="table-row">
    <span style={{ width: '40%' }}>
    <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>
    {item.author}
    </span>
    <span style={{ width: '10%' }}>
    {item.num_comments}
    </span>
    <span style={{ width: '10%' }}>
    {item.points}
    </span>
    <span style={{ width: '10%' }}>
    <Button
    onClick={() => onDismiss(item.objectID)}
    className="button-inline"
    >
    Dismiss
    </Button>
    </span>
    </div>
    )}
</div>

const Button = ({onClick, className = '', children}) => {
  return(
    <button 
    onClick={onClick}
    className={className}
    type="button"
    > {children}
    </button> 
  )
}

export default App;