import {DesignPayload} from "../../../types/Design";
import {PrintTypePayload} from "../../../types/PrintType";
import {PrintZoneStub} from "../../../types/PrintZone";
import {DesignFileStub} from "../../../types/DesignFile";
import {useMemo} from "react";
import {Card, Form, Stack} from "react-bootstrap";
import {ImagezDownloadLink} from "../../images/ImagezDownloadLink";
import {StringUtil} from "zavadil-ts-common";
import {ImagezRemovedBackgroundDownload} from "../../images/ImagezRemovedBackgroundDownload";

export type DesignerAdminZoneProps = {
	design: DesignPayload;
	printType: PrintTypePayload;
}

type SortedZone = {
	zone: PrintZoneStub;
	files: Array<DesignFileStub>;
}

export function DesignerAdminZone({design, printType}: DesignerAdminZoneProps) {

	const sorted: Array<SortedZone> = useMemo(
		() => {
			const result: Array<SortedZone> = [];
			printType.zones.forEach(
				(z) => {
					const files = design.files.filter(f => f.printZoneId === z.id);
					result.push(
						{
							zone: z,
							files: files
						}
					)
				}
			)
			return result;
		},
		[design, printType]
	);

	return <div className="admin-zone">
		<Form.Label>Soubory</Form.Label>
		{
			sorted.map(
				(sz) => <div>
					<strong>{sz.zone.name}</strong>
					<Stack direction="vertical" gap={2}>
						{
							sz.files.map(
								(f) => <Card>
									<Card.Header>
										{StringUtil.ellipsis(f.originalImageName, 25)}
									</Card.Header>
									<Card.Body>
										<Stack direction="horizontal" className="justify-content-between">
											<ImagezDownloadLink name={f.imageName} label="Stáhnout"/>
											{
												f.removeBackgroundColor && <ImagezRemovedBackgroundDownload
													name={f.imageName}
													hex={f.removeBackgroundColor}
													threshold={f.removeBackgroundThreshold}
													label="Stáhnout bez pozadí"
												/>
											}
										</Stack>
									</Card.Body>
								</Card>
							)
						}
					</Stack>

				</div>
			)
		}
	</div>
}
