import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { HotKeys, store } from './model/store';

const rootElement = document.getElementById('root')

HotKeys()

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
)