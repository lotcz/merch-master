package eu.zavadil.openmerch.data.shopOrder;

import lombok.Getter;

public enum OrderState {
	Cart(false, false), //still just a cart
	Pending(true, false), //order is placed, but waiting for payment
	Processing(true, true), //order is paid, waiting for shipping
	Finished(false, true), //order is shipped
	Cancelled(false, false), //order was cancelled before payment
	Returned(true, true), //customer asked for refund
	Refunded(false, false); //order was refunded and goods returned

	@Getter
	private boolean active; // display in normal listings

	@Getter
	private boolean paid;

	OrderState(boolean active, boolean paid) {
		this.active = active;
		this.paid = paid;
	}
}
