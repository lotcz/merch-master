package eu.zavadil.merchmaster.api.creator;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/creator/user")
@Tag(name = "Creator user")
@Slf4j
public class UserController {

	@GetMapping("")
	public String load() {
		return "test";
	}
}
