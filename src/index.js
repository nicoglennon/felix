import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import ExpandingSearchbox from './expanding-searchbox.js';
import felixTheCat from './felix_the_cat.jpg'

// Component Structure
// --------------------
// Container
// --> Title
// --> Form
// --> List
// ----> Todo
// --> Footer

// App component (intelligent)
class App extends React.Component {
  constructor(props) {
    super(props);

    // intro data:

    const introData = [
      {
        id: -6,
        value: "Welcome to Felix, a simple & modern to-do list app.",
        list: "Welcome",
      },
      {
        id: -5,
        value: "Felix was made using React.",
        list: "Welcome",
      },
      {
        id: -4,
        value: "Type into the above line to add a task. Click on the '—' next to an existing task to delete it.",
        list: "Welcome",
      },
      {
        id: -3,
        value: "Complete tasks until you see Felix!",
        list: "Welcome",
      },
      {
        id: -2,
        value: "Felix was designed and built by Nico Glennon.",
        list: "About",
      },
      {
        id: -1,
        value: "You may find the project on Github at www.github.com/nicoglennon/felix.",
        list: "About",
      },
    ]

    const introLists = [
      {
        id: -2,
        name: "Welcome",
      },
      {
        id: -1,
        name: "About",
      },
    ]

    const introCurrentList = 'Welcome';

    this.state = {
      data: introData,
      value: '',
      listOptions: introLists,
      currentList: introCurrentList,
    };
    // bind the handler functions
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.removeTodo = this.removeTodo.bind(this);
    this.handleListChange = this.handleListChange.bind(this);
    this.handleNewListButton = this.handleNewListButton.bind(this);
  }

  handleSubmit(e) {
    // Prevent submission
    e.preventDefault();

    if (this.state.value === '') {
      return;
    }

    const newTodo = {
      id: Date.now(),
      value: this.state.value,
      list: this.state.currentList,
    }

    this.setState(prevState => {
      return {
        data: prevState.data.concat(newTodo),
        value: '',
      }
    })
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  removeTodo(id) {
    const newList = this.state.data.filter(todo => {
      if (todo.id !== id) {
        return todo;
      }
      return null;
    })
    this.setState({ data: newList });
  }

  handleListChange(e) {
    this.setState({ currentList: e.target.innerHTML });
  }

  handleNewListButton(e) {
    const name = prompt("New list name:", "New List");

    if (name === null || name === "") {

    } else {
      const newList = {
          id: Date.now(),
          name: name,
      }

      const newListFirstTodo = {
        id: Date.now(),
        value: 'This is ' + name + ', your new list.',
        list: name,
      }

      this.setState(prevState => {
        return {
          data: prevState.data.concat(newListFirstTodo),
          listOptions: prevState.listOptions.concat(newList),
          currentList: name,
        }
      })
    }
  }

  render() {
		return (
      <div id="pageContainer">
        <div id="sidebarContainer">
          <Sidebar
            listOptions={this.state.listOptions}
            handleListChange={this.handleListChange}
            currentList={this.state.currentList}
            handleNewListButton={this.handleNewListButton}
          />

        </div>
        <div id="appContainer">
          <div id="formAndListsContainer">
            <Form handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              text={this.state.value}
            />
            <h2 className='listTitle'>{this.state.currentList}</h2>
            <List todos={this.state.data}
              remove={this.removeTodo}
              current={this.state.currentList}
            />
          </div>
        </div>
      </div>
		);
	}
}

const Sidebar = ({listOptions, handleListChange, currentList, handleNewListButton}) => {
  return (
    <div className="sidebarContentsWrapper">
      <Title />
      <ListOptions
        listOptions={listOptions}
        handleListChange={handleListChange}
        currentList={currentList}
        handleNewListButton={handleNewListButton}
      />
    </div>
  )
}

const ListOptions = ({listOptions, handleListChange, currentList, handleNewListButton}) => {
  let allListOptions = [];

  if(listOptions.length > 0) {


    allListOptions = listOptions.map(listOption => {
      let listOptionStyle = {};
      if (listOption.name === currentList) {

        // current list style highlight
        listOptionStyle = {
          backgroundColor: '#E8E8E8',
          color: 'black',
        }

      }
      return (<ListOption
                listName={listOption.name}
                key={listOption.id}
                handleListChange={handleListChange}
                style={listOptionStyle}
                // remove={remove}
              />)
    })
  }

  return (
    <div className="listOptionsWrapper">
      <ul className="listOptionsUl">
        {allListOptions}
        <NewListButton
          handleNewListButton={handleNewListButton}>
        </NewListButton>
      </ul>
    </div>
  )
}

const NewListButton = ( {handleNewListButton} ) => {
  return (
    <li className='newListButton'
      onClick={handleNewListButton}>
      (+)
    </li>
  )
}

const ListOption = ({listName, handleListChange, style}) => {
  return (
    <li className='listOption'
      style={style}
      onClick={handleListChange}>
        {listName}
      </li>
  )
}

const Title = () => {
	return (
		<div id="titleWrapper">
			<a href="/" className='titleALink'><h1 className="titleHeader">Felix</h1></a>
		</div>
	);
};

class Form extends React.Component {
  render() {
    return(
      <div id="formWrapper">
        <form onSubmit={this.props.handleSubmit}>
          <input
            onChange={this.props.handleChange}
            value={this.props.text}
            placeholder="Add task..."
          />
        </form>
      </div>
    );
  };

}

// List Component
const List = ({todos, remove, current}) => {
  let filteredTodos = [];
  let displayedTodos = [];
  let felixImage = null;

  filteredTodos = todos.filter( todo => {
    return todo.list === current;
  })

  if(filteredTodos.length > 0) {
    displayedTodos = filteredTodos.map(todo => {
      return (<Todo todo={todo}
                    key={todo.id}
                    remove={remove}
              />)
    })
  } else {
    displayedTodos.push(<li id="acu" key="acu">All caught up!</li>)

    felixImage = <img className="felixTheCat" src={felixTheCat} alt="Felix the Cat" />
  }

  return (
    <div id="listWrapper">
      <ul className="allTodosUl">
        {felixImage}
        {displayedTodos}
      </ul>
    </div>
  )
}

// single Todo Component
const Todo = ({todo, remove}) => {
  // single todo
  return (
      <div className="listItemWrapper"
           key={todo.id}
      >
        <li className="todos">
          {todo.value}
        </li>
        <button
          className="removeBtn"
          onClick={()=> {
            remove(todo.id)
          }}>
          —
        </button>
      </div>
  )
}

// Render the general Container to the DOM
ReactDOM.render(<App />, document.getElementById('root'));
