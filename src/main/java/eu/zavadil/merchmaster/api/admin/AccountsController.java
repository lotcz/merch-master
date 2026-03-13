package eu.zavadil.merchmaster.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.merchmaster.data.account.Account;
import eu.zavadil.merchmaster.service.AccountsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/accounts")
@Tag(name = "Accounts")
@Slf4j
public class AccountsController {

	@Autowired
	AccountsService accountsService;

	@GetMapping("")
	public JsonPage<Account> loadPaged(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(this.accountsService.search(page, size, search, sorting));
	}

	@GetMapping("{id}")
	public Account load(@PathVariable int id) {
		return this.accountsService.loadById(id);
	}

	@PostMapping("")
	public Account insert(@RequestBody Account document) {
		document.setId(null);
		return this.accountsService.save(document);
	}

	@PutMapping("{id}")
	public Account update(@PathVariable int id, @RequestBody Account document) {
		document.setId(id);
		return this.accountsService.save(document);
	}

	@DeleteMapping("{id}")
	public void delete(@PathVariable int id) {
		this.accountsService.delete(id);
	}
}
