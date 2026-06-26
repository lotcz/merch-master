package eu.zavadil.openmerch.data.user;

import lombok.Getter;

public enum UserState {
	Temporary(true),
	Active(true),
	Disabled(false);

	@Getter
	private boolean active;

	UserState(boolean active) {
		this.active = active;
	}
}
