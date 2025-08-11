import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { IRange } from "../../interfaces/commonInterfaces";
import CalendarIcon from "../utilities/svgElements/CalendarIcon";
import { enGB } from "date-fns/locale";
import { format } from "date-fns";

type Props = {
	setDateRangeSelection: (value: IRange[]) => void;
	dateRangeSelection: IRange[];
	isMaxDate?: boolean;
};

const DateRangeSelector: React.FC<Props> = ({
	setDateRangeSelection,
	dateRangeSelection,
	isMaxDate,
}) => {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const pickerRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			pickerRef.current &&
			!pickerRef.current.contains(event.target as Node)
		) {
			setIsPickerOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleRangeChange = (ranges: RangeKeyDict) => {
		const selection = ranges.selection;
		if (selection && selection.startDate && selection.endDate) {
			const validSelection: IRange = {
				startDate: selection.startDate,
				endDate: selection.endDate,
				key: selection.key || "defaultKey",
			};
			setDateRangeSelection([validSelection]);
		}
	};

	return (
		<>
			<button
				onClick={() => setIsPickerOpen(!isPickerOpen)}
				className="theme-btn clear-btn p-0"
			>
				{format(dateRangeSelection[0].startDate, "MMM d, yyyy")}
			</button>
			<span>-</span>
			<button
				onClick={() => setIsPickerOpen(!isPickerOpen)}
				className="theme-btn clear-btn p-0"
			>
				{format(dateRangeSelection[0].endDate, "MMM d, yyyy")}
			</button>
			<span onClick={() => setIsPickerOpen(!isPickerOpen)}>
				<CalendarIcon />
			</span>
			{isPickerOpen && (
				<div ref={pickerRef} className="date-range-picker-show">
					<DateRangePicker
						showDateDisplay={false}
						ranges={dateRangeSelection}
						onChange={handleRangeChange}
						locale={enGB}
						maxDate={isMaxDate ? new Date() : undefined}
						rangeColors={["#CEA344"]}
					/>
				</div>
			)}
		</>
	);
};

export default DateRangeSelector;
