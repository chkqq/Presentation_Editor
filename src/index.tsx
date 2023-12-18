import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './App';
import { addHotKeys, store } from './model/store';

const rootElement = document.getElementById('root')

addHotKeys()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
)