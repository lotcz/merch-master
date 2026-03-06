package eu.zavadil.merchmaster.data.creator.shop;

import lombok.Getter;

public enum ShopState {
	Pending(false),
	Approved(true),
	Disabled(false);

	@Getter
	private boolean active;

	ShopState(boolean active) {
		this.active = active;
	}
}
