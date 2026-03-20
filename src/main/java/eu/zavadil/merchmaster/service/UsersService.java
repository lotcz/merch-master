package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.user.User;
import eu.zavadil.merchmaster.data.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

	@Autowired
	UserRepository repository;

	public Page<User> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public User loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public User save(User user) {
		return this.repository.save(user);
	}

	public void delete(int id) {
		this.repository.deleteById(id);
	}

	public void delete(User user) {
		if (user.getId() != null) this.delete(user.getId());
	}

	public Page<User> loadSyncQueue() {
		return this.repository.findBySyncStateOrderByLastUpdatedOn(SyncState.Pending, PagingUtils.of(0, 10));
	}
}
