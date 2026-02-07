import {DesignPayload} from "../../types/Design";
import {PrintTypePayload} from "../../types/PrintType";
import {PrintZoneStub} from "../../types/PrintZone";
import {DesignFileStub} from "../../types/DesignFile";
import {useMemo} from "react";
import {Form, Table} from "react-bootstrap";
import {ImagezDownloadLink} from "../images/ImagezDownloadLink";
import {StringUtil} from "zavadil-ts-common";

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

	return <div>
		<Form.Label>Soubory</Form.Label>
		{
			sorted.map(
				(sz) => <div>
					<strong>{sz.zone.name}</strong>
					<Table>
						{
							sz.files.map(
								(f) => <tr>
									<td>{StringUtil.ellipsis(f.originalImageName, 25)}</td>
									<td><ImagezDownloadLink name={f.imageName} label="Stáhnout"/></td>
								</tr>
							)
						}
					</Table>
				</div>
			)
		}
	</div>
}
