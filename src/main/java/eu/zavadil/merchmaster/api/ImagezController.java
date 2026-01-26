package eu.zavadil.merchmaster.api;

import eu.zavadil.java.imagez.client.*;
import eu.zavadil.java.spring.common.exceptions.ServerErrorException;
import eu.zavadil.java.util.FileNameUtils;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${api.base-url}/imagez")
@Tag(name = "Images")
@Slf4j
public class ImagezController {

	@Autowired
	ImagezSmartApi imagez;

	@GetMapping("url/resized/{name}")
	public String getUrlResized(
		@PathVariable String name,
		@RequestParam ResizeType type,
		@RequestParam int width,
		@RequestParam int height,
		@RequestParam(defaultValue = "", required = false) String ext,
		@RequestParam(defaultValue = "", required = false) VerticalAlign verticalAlign,
		@RequestParam(defaultValue = "", required = false) HorizontalAlign horizontalAlign
	) {
		return this.imagez.getImageUrlResized(
			name,
			new ResizeRequest(type, width, height, ext, verticalAlign, horizontalAlign)
		).toString();
	}

	@GetMapping("url/original/{name}")
	public String getUrlOriginal(@PathVariable String name) {
		return this.imagez.getImageUrlOriginal(name).toString();
	}

	@GetMapping("health/{name}")
	public ImageHealthPayload getImageHealth(@PathVariable String name) {
		return this.imagez.getHealth(name);
	}

	@PostMapping("upload")
	public ImageHealthPayload uploadImage(@RequestParam("image") MultipartFile file) {
		String originalFileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		try {
			return this.imagez.upload(originalFileName, file.getBytes());
		} catch (Exception e) {
			log.error(e.getMessage());
			throw new ServerErrorException(e);
		}
	}

}
