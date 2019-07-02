import { h, Component } from "preact";
import styles from "./style.scss";

export default class Cart extends Component {

    getItemTotal(qty, price) {
        const total = qty * price;
        return total.toFixed(2);
    }

    render(props) {
        return (
            <div className={styles.sullycartContainer}>
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
            </div>
        );
    }
}
