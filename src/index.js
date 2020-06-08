import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ApolloClient from "apollo-boost";
import {ApolloProvider} from '@apollo/react-hooks';

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
