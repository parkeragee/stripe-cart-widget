import { h, Component } from "preact";
import styles from "./style.scss";

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
                    <div className={styles.sullycartItem}>
                        <div className={styles.sullycartItemName}>{item.name}</div>
                        <div>${item.price} ea.</div>
                        <div className={styles.qtyManage}>
                            <div style={{ borderColor: props.buttonColor, background: props.buttonColor }} onClick={() => props.removeFromCart(item.sku)} className={styles.sullycartQtyRemove}>-</div>
                            <div style={{ borderColor: props.buttonColor }} className={styles.sullycartQtyCount}>{item.quantity}</div>
                            <div style={{ borderColor: props.buttonColor, background: props.buttonColor }} onClick={() => props.addToCart(item.sku, item.price, item.name)} className={styles.sullycartQtyAdd}>+</div>
                        </div>
                    </div>
                ))}
                <div className="cart-total"><b>Total: ${this.getCartTotal()}</b></div>
            </div>
        );
    }
}
