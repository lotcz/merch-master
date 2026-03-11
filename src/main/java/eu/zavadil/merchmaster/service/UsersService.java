package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.SyncState;
import eu.zavadil.merchmaster.data.creator.user.User;
import eu.zavadil.merchmaster.data.creator.user.UserRepository;
import eu.zavadil.merchmaster.data.creator.user.UserStub;
import eu.zavadil.merchmaster.data.creator.user.UserStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

	@Autowired
	UserStubRepository stubRepository;

	@Autowired
	UserRepository repository;

	public Page<User> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public User loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public UserStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public User save(User user) {
		user.setSyncState(SyncState.Pending);
		return this.repository.save(user);
	}

	public UserStub saveStub(UserStub userStub) {
		userStub.setSyncState(SyncState.Pending);
		return this.stubRepository.save(userStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(UserStub userStub) {
		if (userStub.getId() != null) this.delete(userStub.getId());
	}

	public void delete(User user) {
		if (user.getId() != null) this.delete(user.getId());
	}

	public List<User> loadAllByAccountId(int accountId) {
		return this.repository.findAllByAccountId(accountId);
	}
}
