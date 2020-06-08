import React, {useState} from 'react';
import {useMutation, useQuery,} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';

const GET_TODOS = gql`
    query getTodos {
        todos {
            id
            text
            done
        }
    }
`

const TOGGLE_TODO = gql`
    mutation toggleTodo($id: uuid!, $done: Boolean!) {
        update_todos(where: {id: {_eq: $id}}, _set: {done: $done}) {
            returning {
                done
                id
                text
            }
        }
    }
`


const ADD_TODO = gql`
    mutation addTodo($text: String!) {
        insert_todos(objects: {text: $text}) {
            returning {
                done
                text
                id
            }
        }
    }
`

const DELETE_TODO = gql`
    mutation deleteTodo($id: uuid!) {
        delete_todos(where: {id: {_eq: $id}}) {
            returning{
                id
            }
        }
    }
`

function App() {
    const [todoText, setTodoText] = useState('');
    const {loading, data, error} = useQuery(GET_TODOS);
    const [toggleTodo] = useMutation(TOGGLE_TODO);
    const [deleteTodo] = useMutation(DELETE_TODO);
    const [addTodo] = useMutation(ADD_TODO, {onCompleted: () => setTodoText('')});

    if (loading) return <div>loading</div>
    if (error) return <div>{error.toString()}</div>

    async function handleToggleTodo({id, done}) {
        const data = await toggleTodo({variables: {id: id, done: !done}});
    }

    function onDeleteTodo(id) {
        const isConfirmed = window.confirm('Do you want to delete this todo')

        if (isConfirmed) {
            deleteTodo({
                variables: {id},
                update: cache => {
                    const prevData = cache.readQuery({query: GET_TODOS})
                    const newTodos = prevData.todos.filter(todo => todo.id !== id);
                    cache.writeQuery({query: GET_TODOS, data: {todos: newTodos}})
                }
            });
        }

    }

    function onAddTodo(e) {
        e.preventDefault();
        if (todoText.trim()) {
            addTodo(
                {
                    variables: {text: todoText},
                    refetchQueries: [
                        {query: GET_TODOS}
                    ]
                }
            );
        }
    }

    return (
        <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
            <h1 className='f2-l'>GraphQL Checklist {' '}<span role='img' aria-label='Checkmark'>☑</span></h1>
            <form onSubmit={onAddTodo} className='mb3'>
                <input
                    className='pa2 f4 b--dashed'
                    type="text"
                    placeholder="Create your todo"
                    onChange={(e) => setTodoText(e.target.value)}
                    value={todoText}
                />
                <button type='submit' className='pa2 f4 bg-green'>Create</button>
            </form>
            <ul className='flex items-center justify-center flex-column'>
                {data && data.todos.map((todo) => (
                    <li onDoubleClick={() => handleToggleTodo(todo)} key={todo.id}>
                        <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>{todo.text}</span>
                        <button onClick={() => onDeleteTodo(todo.id)} className='bg-transparent bn f4'>
                            <span className='red'>&times;
                            </span>
                        </button>
                    </li>
                ))
                }
            </ul>
        </div>
    );
}

export default App;
