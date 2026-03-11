package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.creator.account.Account;
import eu.zavadil.merchmaster.data.creator.account.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AccountsService {

	@Autowired
	AccountRepository repository;

	public Page<Account> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Account loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public Account save(Account account) {
		if (account.getUuid() == null) {
			account.setUuid(UUID.randomUUID());
		}
		return this.repository.save(account);
	}

	public void delete(int id) {
		this.repository.deleteById(id);
	}

	public void delete(Account account) {
		if (account.getId() != null) this.delete(account.getId());
	}
}
