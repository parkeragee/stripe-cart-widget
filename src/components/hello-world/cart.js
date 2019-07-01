import { h, Component } from "preact";
import "./style.scss";

export default class Cart extends Component {

    getCartTotal() {
        const total = this.props.items.length > 0 ? this.props.items.reduce((previous, item) => previous + (item.price * item.quantity), 0) : 0;
        return total.toFixed(2);
    }

    getItemTotal(qty, price) {
        const total = qty * price;
        return total.toFixed(2);
    }

    render(props) {
        return (
            <div>
                {props.items.map(item => (
                    <div>
                        <div className="item">{item.name} - ${item.price} ea.</div>
                        <div className="qty">Qty: {item.quantity}</div>
                        <div className="total">Item total: ${this.getItemTotal(item.quantity, item.price)}</div>
                        <hr/>
                    </div>
                ))}
                <div className="cart-total"><b>Cart total: ${this.getCartTotal()}</b></div>
            </div>
        );
    }
}
