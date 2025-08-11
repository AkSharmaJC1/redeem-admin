/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, forwardRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface AutocompleteAddressProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	onLocationSelect?: (lat: number, lng: number) => void;
	onAddressSelect?: (
		address: string,
		components: google.maps.GeocoderAddressComponent[]
	) => void;
	placeholder?: string;
	onChange?: () => void;
}

const AutocompleteAddress = forwardRef<
	HTMLInputElement,
	AutocompleteAddressProps<any>
>(
	(
		{ name, control, onLocationSelect, onAddressSelect, onChange, placeholder },
		ref
	) => {
		const [autocomplete, setAutocomplete] =
			useState<google.maps.places.Autocomplete | null>(null);

		const { isLoaded } = useJsApiLoader({
			googleMapsApiKey: "AIzaSyAgyFYOc2aY3h48J6RCQD-3pS09vGdDb9I", // Use your API key here
			libraries: ["places"],
		});

		console.log(">>>isLoaded", isLoaded);

		const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
			autocompleteInstance.setComponentRestrictions({ country: "us" });

			console.log(">>>autocompleteInstance", autocompleteInstance);

			setAutocomplete(autocompleteInstance);
		};

		const onPlaceChanged = () => {
			console.log(">>>>autocomplete", autocomplete);

			if (autocomplete) {
				const place = autocomplete.getPlace();
				if (place.geometry) {
					const lat = place.geometry.location?.lat();
					const lng = place.geometry.location?.lng();
					if (lat !== undefined && lng !== undefined) {
						onLocationSelect && onLocationSelect(lat, lng);
					}

					const address = place.formatted_address || "";
					const addressComponents = place.address_components || [];

					// Update the input field with the selected address
					onAddressSelect && onAddressSelect(address, addressComponents);
				}
			}
		};

		if (!isLoaded) return <div>Loading...</div>;

		return (
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
						<input
							{...field}
							ref={ref}
							value={field.value}
							onChange={(e) => {
								field.onChange(e.target.value);
								onChange && onChange();
							}}
							type="text"
							placeholder={placeholder || "Enter address"}
							className="form-control"
						/>
					</Autocomplete>
				)}
			/>
		);
	}
);

export default AutocompleteAddress;
