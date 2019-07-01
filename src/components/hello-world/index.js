import { h, Component } from "preact";
import "./style.scss";

export default class App extends Component {

    constructor() {
        super();
        this.state.items = [];
    }

    componentDidMount() {
        const buttons = document.querySelectorAll('[data-cart-add]');
        const removeButtons = document.querySelectorAll('[data-cart-add-remove]');
        const checkoutButton = document.querySelector('[data-cart-checkout]');
        const emptyButton = document.querySelector('[data-cart-empty]');
        checkoutButton.addEventListener('click', () => this.handleCheckout());
        emptyButton.addEventListener('click', () => this.emptyCart());
        buttons.forEach(elem => elem.addEventListener('click', () => this.handleShoppingCartClick(elem.getAttribute('data-cart-add'))));
        removeButtons.forEach(elem => elem.addEventListener('click', () => this.handleRemoveFromShoppingCartClick(elem.getAttribute('data-cart-add-remove'))));
        const initialState = localStorage.getItem('items');
        initialState !== null ? this.setState({ items: JSON.parse(initialState) }) : false;
    }

    handleRemoveFromShoppingCartClick(productId) {
        const productIndex = this.state.items.findIndex(item => item.sku === productId);
        return this._decrementQuantity(productIndex);
    }

    handleShoppingCartClick(productId) {
        const item = { sku: productId, quantity: 1 };
        const productIndex = this.state.items.findIndex(item => item.sku === productId);
        return productIndex > -1 ? this._incrementQuantity(productIndex) : this._addToCart(item);
    }

    _incrementQuantity(productIndex) {
        const newItems = this.state.items.slice();
        ++newItems[productIndex].quantity;
        this._setCartState({ items: newItems });
    }

    _decrementQuantity(productIndex) {
        const newItems = this.state.items.slice();
        const currentQuantity = newItems[productIndex].quantity;
        currentQuantity === 1 ? newItems.splice(productIndex, 1) : --newItems[productIndex].quantity;
        this._setCartState({ items: newItems });
    }

    _addToCart(item) {
        this._setCartState({ items: [...this.state.items, item] });
    }

    /**
     * Sets the state of the cart in local state and localStorage
     * @param  {Object} itemsObject The items object
     * @return {void}
     */
    _setCartState(itemsObject) {
        this.setState(itemsObject);
        localStorage.setItem(Object.keys(itemsObject)[0], JSON.stringify(Object.values(itemsObject)[0]));
    }

    emptyCart() {
        this.setState({ items: [] });
        localStorage.removeItem('items');
    }

    handleCheckout() {
        const stripe = Stripe(this.props.stripeKey);
        stripe.redirectToCheckout({
            items: this.state.items,
            successUrl: 'https://preact-widget-netlify.com/success',
            cancelUrl: 'https://preact-widget-netlify.com/cancel',
        }).then((result) => {
            return alert(result.error.message);
        });
    }


    render(props) {
        return (
            <div>
                {JSON.stringify(this.state.items)}
                <h1>Hello, World!</h1>
            </div>
        );
    }
}
