import { useState } from "react";

interface SelectProps {
	defaultSelectValue: string;
	selectOptions: string[];
	handleSelectChange: (e: React.ChangeEventHandler<HTMLSelectElement>) => void;
}

const Select = ({
	defaultSelectValue,
	handleSelectChange,
	selectOptions,
}: SelectProps) => {
	const [selectVal, setSelectVal] = useState(defaultSelectValue);
	return (
		<select
			value={selectVal}
			onChange={(e) => {
				setSelectVal(e.target.value);
				handleSelectChange(e);
			}}
			className="border rounded-sm border-slate-800 p-2 focus:outline-none focus:ring-1 focus:ring-slate-900"
		>
			{selectOptions.map((option) => (
				<option key={option} value={option}>
					{option.charAt(0).toUpperCase() + option.slice(1)}
				</option>
			))}
		</select>
	);
};

export default Select;