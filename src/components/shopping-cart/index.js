import { h, Component } from "preact";
import Cart from './cart';
import styles from "./style.scss";
import cx from 'classnames';

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            items: [],
            isCartShowing: false,
        };
        this.handleShoppingCartClick = this.handleShoppingCartClick.bind(this);
        this.handleRemoveFromShoppingCartClick = this.handleRemoveFromShoppingCartClick.bind(this);
    }

    componentDidMount() {
        const addButtons = document.querySelectorAll('[data-cart-add]');
        const removeButtons = document.querySelectorAll('[data-cart-remove]');
        const showcartButton = document.querySelector('[data-cart-show]');
        const emptyButton = document.querySelector('[data-cart-empty]');

        if (showcartButton !== null) {
            showcartButton.addEventListener('click', () => this.handleShowcart());
        }

        if (emptyButton !== null) {
            emptyButton.addEventListener('click', () => this.emptyCart());    
        }

        addButtons.forEach(elem => elem.addEventListener('click', () => {
            this.handleShoppingCartClick(
                elem.getAttribute('data-cart-add'),
                parseInt(elem.getAttribute('data-cart-price'), 10).toFixed(2),
                elem.getAttribute('data-cart-name'),
            )
        }));

        removeButtons.forEach(elem => elem.addEventListener('click', () => this.handleRemoveFromShoppingCartClick(elem.getAttribute('data-cart-remove'))));

        const initialState = localStorage.getItem('items');
        initialState !== null ? this.setState({ items: JSON.parse(initialState) }) : false;
    }

    handleShowcart() {
        this.setState({ isCartShowing: true });
        const elem = document.querySelector('.sullycartDisplay');
        elem.classList.add('visible');
    }

    handleHidecart() {
        const elem = document.querySelector('.sullycartDisplay');
        elem.classList.remove('visible');
        this.setState({ isCartShowing: false });
    }

    handleRemoveFromShoppingCartClick(productId) {
        const productIndex = this.state.items.findIndex(item => item.sku === productId);
        return this._decrementQuantity(productIndex);
    }

    handleShoppingCartClick(productId, productPrice, productName) {
        const item = { sku: productId, quantity: 1, price: productPrice, name: productName };
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
        const { stripeKey, cancelUrl, successUrl } = this.props;
        const items = this.state.items.map(item => { return { sku: item.sku, quantity: item.quantity } });
        const stripe = Stripe(this.props.stripeKey);
        stripe.redirectToCheckout({
            items,
            successUrl,
            cancelUrl,
        }).then((result) => {
            return alert(result.error.message);
        });
    }

    getCartTotal() {
        const { items } = this.state;
        const total = items.length > 0 ? items.reduce((previous, item) => previous + (item.price * item.quantity), 0) : 0;
        return total.toFixed(2);
    }


    render(props) {
        const { items, isCartShowing } = this.state;
        const classNames = isCartShowing ? cx(styles.sullycartWrapper, styles.visible) : styles.sullycartWrapper;
        return (
            <div className={`${classNames} sullycartDisplay`}>
                {isCartShowing &&
                    <div>
                        <Cart
                            buttonColor={props.buttonColor}
                            addToCart={this.handleShoppingCartClick}
                            removeFromCart={this.handleRemoveFromShoppingCartClick}
                            items={items} />
                        <div className="cart-total"><b>Total: ${this.getCartTotal()}</b></div>
                        <button onClick={() => this.handleCheckout()} style={{backgroundColor: props.buttonColor}} className={styles.sullycartCheckoutBtn}>Proceed to checkout</button>
                        <span onClick={() => this.handleHidecart()} className={styles.sullycartCloseCart}>Close cart</span>
                    </div>
                }
            </div>
        );
    }
}
