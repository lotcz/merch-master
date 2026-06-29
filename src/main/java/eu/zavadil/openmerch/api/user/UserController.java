package eu.zavadil.openmerch.api.user;

import eu.zavadil.openmerch.data.user.User;
import eu.zavadil.openmerch.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/users")
@Tag(name = "User")
@Slf4j
public class UserController {

	@Autowired
	UsersService usersService;

	@GetMapping("profile")
	public User getMyself(@AuthenticationPrincipal User user) {
		return user;
	}

	@PutMapping("profile/password")
	@Secured("ROLE_USER")
	public void changeMyPassword(
		@AuthenticationPrincipal User user,
		@RequestBody String password
	) {
		this.usersService.changeUserPassword(user, password);
	}
}
