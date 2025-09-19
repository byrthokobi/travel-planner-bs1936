import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface ModernDatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (date: Dayjs | null) => void;
    minDate?: Dayjs;
}

export default function ModernDatePicker({ label, value, onChange, minDate }: ModernDatePickerProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                label={label}
                value={value}
                onChange={onChange}
                minDate={minDate}
                disablePast
                slotProps={{
                    textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: {
                            mb: "12px",
                            "& .MuiInputBase-root": {
                                borderRadius: "12px", // rounded corners
                                backgroundColor: "#f9fafb", // light modern bg
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // soft shadow
                                transition: "0.2s",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#e5e7eb",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3b82f6", // blue on hover
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2563eb", // darker blue on focus
                                borderWidth: 2,
                            },
                            "& .MuiInputBase-input": {
                                padding: "12px 14px",
                                fontSize: "0.95rem",
                                fontWeight: 500,
                            },
                            "& label": {
                                fontWeight: 500,
                                color: "#374151",
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}
