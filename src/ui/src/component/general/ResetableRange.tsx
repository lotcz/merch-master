import React from "react";
import {Form, Stack} from "react-bootstrap";
import {IconButton} from "zavadil-react-common";
import {BsArrowClockwise} from "react-icons/bs";

export type ResetableRangeParams = {
	label?: string;
	defaultValue?: number;
	value: number;
	min: number;
	max: number;
	step?: number
	onChange: (value: number) => any;
}

export default function ResetableRange({
	label,
	value,
	min,
	max,
	step = 1,
	defaultValue = 0,
	onChange
}: ResetableRangeParams) {
	return <Form.Group>
		{
			label && <Form.Label className="text-small">
				{label}
			</Form.Label>
		}
		<Stack direction="horizontal" gap={2}>
			<Form.Range
				value={value}
				min={min}
				max={max}
				step={step}
				onChange={
					(deg) => {
						onChange(Number(deg.target.value));
					}
				}
			/>
			<IconButton disabled={value === defaultValue} size="sm" onClick={() => onChange(defaultValue)} icon={<BsArrowClockwise/>}/>
		</Stack>
	</Form.Group>
}
