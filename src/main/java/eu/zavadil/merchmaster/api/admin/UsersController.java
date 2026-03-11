package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.merchmaster.data.creator.user.User;
import eu.zavadil.merchmaster.data.creator.user.UserStub;
import eu.zavadil.merchmaster.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/users")
@Tag(name = "Users")
@Slf4j
public class UsersController {

	@Autowired
	UsersService usersService;

	@GetMapping("")
	public JsonPage<User> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.usersService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public UserStub load(@PathVariable int id) {
		return this.usersService.loadStubById(id);
	}

	@PostMapping("")
	public UserStub insert(@RequestBody UserStub document) {
		document.setId(null);
		return this.usersService.saveStub(document);
	}

	@PutMapping("{id}")
	public UserStub update(@PathVariable int id, @RequestBody UserStub document) {
		document.setId(id);
		return this.usersService.saveStub(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.usersService.delete(id);
	}

	@GetMapping("by-account/{accountId}")
	public List<User> loadAllByAccount(@PathVariable int accountId) {
		return this.usersService.loadAllByAccountId(accountId);
	}
}
