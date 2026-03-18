package eu.zavadil.merchmaster.api.pub;

import eu.zavadil.java.util.EnumUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.account.AccountState;
import eu.zavadil.merchmaster.data.shop.ShopState;
import eu.zavadil.merchmaster.data.shopOrder.OrderState;
import eu.zavadil.merchmaster.data.user.UserState;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/enumerations")
@Tag(name = "Enumerations")
@Slf4j
public class EnumerationsController {

	@GetMapping("user-states")
	public List<String> userStates() {
		return EnumUtils.namesOf(UserState.class);
	}

	@GetMapping("sync-states")
	public List<String> syncStates() {
		return EnumUtils.namesOf(SyncState.class);
	}

	@GetMapping("order-states")
	public List<String> orderStates() {
		return EnumUtils.namesOf(OrderState.class);
	}

	@GetMapping("shop-states")
	public List<String> shopStates() {
		return EnumUtils.namesOf(ShopState.class);
	}

	@GetMapping("account-states")
	public List<String> accountStates() {
		return EnumUtils.namesOf(AccountState.class);
	}
}
