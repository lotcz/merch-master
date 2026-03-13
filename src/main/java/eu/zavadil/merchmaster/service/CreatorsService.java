package eu.zavadil.merchmaster.service;

import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.merchmaster.data.creator.Creator;
import eu.zavadil.merchmaster.data.creator.CreatorRepository;
import eu.zavadil.merchmaster.data.creator.CreatorStub;
import eu.zavadil.merchmaster.data.creator.CreatorStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreatorsService {

	@Autowired
	CreatorStubRepository stubRepository;

	@Autowired
	CreatorRepository repository;

	public Page<Creator> search(int page, int size, String search, String sorting) {
		return this.repository.search(search, PagingUtils.of(page, size, sorting));
	}

	public Creator loadById(int id) {
		return this.repository.findById(id).orElse(null);
	}

	public CreatorStub loadStubById(int id) {
		return this.stubRepository.findById(id).orElse(null);
	}

	public Creator save(Creator creator) {
		return this.repository.save(creator);
	}

	public CreatorStub saveStub(CreatorStub creatorStub) {
		return this.stubRepository.save(creatorStub);
	}

	public void delete(int id) {
		this.stubRepository.deleteById(id);
	}

	public void delete(CreatorStub creatorStub) {
		if (creatorStub.getId() != null) this.delete(creatorStub.getId());
	}

	public void delete(Creator creator) {
		if (creator.getId() != null) this.delete(creator.getId());
	}

	public List<Creator> loadAllByAccountId(int accountId) {
		return this.repository.findAllByAccountId(accountId);
	}

	Creator loadByUserId(int userId) {
		return this.repository.findFirstByUserId(userId).orElse(null);
	}

	CreatorStub loadStubByUserId(int userId) {
		return this.stubRepository.findFirstByUserId(userId).orElse(null);
	}
}
