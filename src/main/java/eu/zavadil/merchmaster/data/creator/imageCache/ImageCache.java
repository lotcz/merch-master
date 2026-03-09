package eu.zavadil.merchmaster.data.creator.imageCache;

import eu.zavadil.merchmaster.data.admin.printZone.PrintZone;
import eu.zavadil.merchmaster.data.creator.account.Account;
import eu.zavadil.merchmaster.data.creator.design.Design;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "image_cache")
public class ImageCache extends ImageCacheBase {

	@ManyToOne(optional = false)
	private Account accunt;
}
