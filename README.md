#Apollo notes
[Создание сервера и клиента apollo](https://hasura.io/)

Создание клиента
```
const client = new ApolloClient({
    uri: 'https://todo-bygaga.herokuapp.com/v1/graphql'
});

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
```

Полезные хуки и функция для создания запросов:
```
import {useMutation, useQuery,} from "@apollo/react-hooks";
import {gql} from 'apollo-boost';
```

Создавать запросы лучше в клиенте, после этого сохранять их в uppercase переменные
```
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
``` 

useQuery возвращает объект, useMutation возвращает массив с функцией, так же есть масса полезных параметров которые принимает хук, например cb
```
const {loading, data, error} = useQuery(GET_TODOS);
const [addTodo] = useMutation(ADD_TODO, {onCompleted: () => setTodoText('')});
```

У apollo есть объект cache, в котором он хронит свои состояния.
Во время мутации можно передать объект update, в котором самостоятельно обновть кэш.
```
deleteTodo({
    variables: {id},
    update: cache => {
        const prevData = cache.readQuery({query: GET_TODOS})
        const newTodos = prevData.todos.filter(todo => todo.id !== id);
        cache.writeQuery({query: GET_TODOS, data: {todos: newTodos}})
    }
});
```